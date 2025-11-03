# Active Status Implementation Guide

## Overview
This implementation uses a hybrid approach combining polling and future WebSocket support for real-time active status updates.

## Frontend Setup

### 1. Add Heartbeat to Your App

In your root layout file (`app/_layout.jsx` or main app component):

```javascript
import { useHeartbeat } from '@/hooks/useHeartbeat';

export default function RootLayout() {
  // Start heartbeat service - sends updates every 3 minutes when app is active
  useHeartbeat();
  
  return (
    // Your app layout
  );
}
```

### 2. Display Active Status

#### Example 1: User Profile/Card
```javascript
import { ActiveStatusIndicator, ActiveStatusDot } from '@/components/ActiveStatusIndicator';
import { useActiveStatus } from '@/hooks/useActiveStatus';

function UserCard({ userId }) {
  const { isOnline, lastSeen } = useActiveStatus(userId);
  
  return (
    <View>
      <Image source={{ uri: userAvatar }} style={styles.avatar}>
        {/* Dot overlay on avatar */}
        <ActiveStatusDot 
          isOnline={isOnline} 
          size="small" 
          style={styles.avatarDot} 
        />
      </Image>
      
      {/* Text indicator */}
      <ActiveStatusIndicator lastSeen={lastSeen} isOnline={isOnline} />
    </View>
  );
}
```

#### Example 2: Group/Linkup Active Members
```javascript
import { GroupActiveCount } from '@/components/ActiveStatusIndicator';
import { useGroupActiveMembers } from '@/hooks/useActiveStatus';

function LinkupCard({ linkupId, totalMembers }) {
  const { activeCount } = useGroupActiveMembers(linkupId, true); // true = enable polling
  
  return (
    <View>
      <Text>{linkupName}</Text>
      <GroupActiveCount count={activeCount} total={totalMembers} />
    </View>
  );
}
```

#### Example 3: Simple Status Text
```javascript
import { getStatusText, isUserOnline } from '@/utils/activeStatusUtils';

function MessageItem({ lastSeen }) {
  const statusText = getStatusText(lastSeen);
  const online = isUserOnline(lastSeen);
  
  return (
    <Text style={{ color: online ? 'green' : 'gray' }}>
      {statusText}
    </Text>
  );
}
```

## Backend Implementation

### 1. Update PublicProfile Model

Add these fields to your `PublicProfile` schema:

```javascript
const PublicProfileSchema = new mongoose.Schema({
  // ...existing fields
  
  isOnline: { 
    type: Boolean, 
    default: false 
  },
  lastSeen: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for efficient queries
PublicProfileSchema.index({ lastSeen: -1 });
PublicProfileSchema.index({ isOnline: 1, lastSeen: -1 });
```

### 2. Update Linkup Model (Optional)

For tracking active members in groups:

```javascript
const LinkupSchema = new mongoose.Schema({
  // ...existing fields
  
  activeMembers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "PublicProfile" 
  }]
});

// Virtual for active member count
LinkupSchema.virtual('activeMemberCount').get(function() {
  return this.activeMembers ? this.activeMembers.length : 0;
});
```

### 3. Create Heartbeat Controller

Create `controllers/activityController.js`:

```javascript
const PublicProfile = require('../models/PublicProfile');

// Update user's last seen timestamp
const updateHeartbeat = async (req, res) => {
  try {
    const firebaseUid = req.user?.uid || req.user?.sub || req.user?.userId;
    
    if (!firebaseUid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await PublicProfile.findOneAndUpdate(
      { uid: firebaseUid },
      { 
        isOnline: true,
        lastSeen: new Date()
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ 
      success: true,
      lastSeen: profile.lastSeen 
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({ message: "Error updating heartbeat", error: error.message });
  }
};

// Get user's active status
const getUserStatus = async (req, res) => {
  try {
    const { userId } = req.params; // This is the Firebase UID
    
    const profile = await PublicProfile.findOne({ uid: userId })
      .select('isOnline lastSeen');

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if lastSeen is within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isOnline = profile.lastSeen >= fiveMinutesAgo;

    res.json({
      isOnline,
      lastSeen: profile.lastSeen
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ message: "Error fetching status", error: error.message });
  }
};

// Get online users (within last 5 minutes)
const getOnlineUsers = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const onlineUsers = await PublicProfile.find({
      lastSeen: { $gte: fiveMinutesAgo }
    }).select('uid username images lastSeen');

    res.json({
      count: onlineUsers.length,
      users: onlineUsers
    });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ message: "Error fetching online users", error: error.message });
  }
};

// Get active members in a linkup
const getActiveLinkupMembers = async (req, res) => {
  try {
    const { linkupId } = req.params;
    const Linkup = require('../models/Linkup');
    
    const linkup = await Linkup.findById(linkupId)
      .populate({
        path: 'members',
        select: 'uid username images lastSeen'
      });

    if (!linkup) {
      return res.status(404).json({ message: "Linkup not found" });
    }

    // Filter members active in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeMembers = linkup.members.filter(member => 
      member.lastSeen && member.lastSeen >= fiveMinutesAgo
    );

    res.json({
      count: activeMembers.length,
      total: linkup.members.length,
      members: activeMembers
    });
  } catch (error) {
    console.error('Get active linkup members error:', error);
    res.status(500).json({ message: "Error fetching active members", error: error.message });
  }
};

module.exports = {
  updateHeartbeat,
  getUserStatus,
  getOnlineUsers,
  getActiveLinkupMembers
};
```

### 4. Create Routes

Create `routes/activity.js` or add to existing routes:

```javascript
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth'); // Your auth middleware
const {
  updateHeartbeat,
  getUserStatus,
  getOnlineUsers,
  getActiveLinkupMembers
} = require('../controllers/activityController');

// Update user's heartbeat (protected)
router.post('/users/heartbeat', verifyToken, updateHeartbeat);

// Get user's status (can be public or protected based on your needs)
router.get('/users/:userId/status', getUserStatus);

// Get all online users (protected)
router.get('/users/online', verifyToken, getOnlineUsers);

// Get active members in a linkup (protected)
router.get('/linkups/:linkupId/active-members', verifyToken, getActiveLinkupMembers);

module.exports = router;
```

### 5. Register Routes in Server

In your `server.js` or `app.js`:

```javascript
const activityRoutes = require('./routes/activity');

// ... other middleware

app.use('/api', activityRoutes);
```

### 6. Optional: Background Job to Mark Users Offline

Create a scheduled job to mark inactive users as offline (optional but recommended):

```javascript
// utils/cleanupInactiveUsers.js
const cron = require('node-cron');
const PublicProfile = require('../models/PublicProfile');

// Run every 10 minutes
const cleanupInactiveUsers = cron.schedule('*/10 * * * *', async () => {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    const result = await PublicProfile.updateMany(
      { 
        lastSeen: { $lt: tenMinutesAgo },
        isOnline: true
      },
      { 
        isOnline: false 
      }
    );
    
    console.log(`Marked ${result.modifiedCount} users as offline`);
  } catch (error) {
    console.error('Error cleaning up inactive users:', error);
  }
});

module.exports = cleanupInactiveUsers;
```

In your `server.js`:
```javascript
const cleanupInactiveUsers = require('./utils/cleanupInactiveUsers');

// Start the cleanup job
cleanupInactiveUsers.start();
```

## Summary

**Frontend:**
1. ✅ `hooks/useHeartbeat.js` - Sends heartbeat every 3 minutes
2. ✅ `hooks/useActiveStatus.js` - Fetches user/group status
3. ✅ `utils/activeStatusUtils.js` - Helper functions
4. ✅ `components/ActiveStatusIndicator.jsx` - UI components

**Backend:**
1. ⚠️ Update `PublicProfile` model (add `isOnline`, `lastSeen`)
2. ⚠️ Update `Linkup` model (optional - add `activeMembers`)
3. ⚠️ Create `controllers/activityController.js`
4. ⚠️ Create `routes/activity.js`
5. ⚠️ Register routes in server
6. ⚠️ Optional: Add background cleanup job

**Migration (If you have existing users):**
```javascript
// Run this once to add fields to existing documents
db.publicprofiles.updateMany(
  {},
  {
    $set: {
      isOnline: false,
      lastSeen: new Date()
    }
  }
);
```
