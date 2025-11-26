 # Notification Integration - Flexible System Design

## Design Philosophy

**This notification system is designed to be generic and extensible**, handling notifications for:
- ✅ Linkups (join requests, member updates)
- ✅ Apartments (bookings, reviews, availability)
- ✅ Events (reminders, cancellations, updates)
- ✅ Payments (receipts, payouts)
- ✅ System alerts (updates, verifications)

### Key Benefits

1. **No Schema Changes Needed**: Add new notification types without modifying the database schema
2. **Flexible Metadata**: Store any data specific to each notification type in the `metadata` field
3. **Dynamic Actions**: Define interactive buttons/actions for any notification
4. **Category-Based Filtering**: Group notifications by category (social, booking, payment, etc.)
5. **Priority System**: Distinguish urgent notifications from informational ones
6. **Resource Linking**: Generic `resourceType` and `resourceId` fields link to any model

## Updated Notification Schema

```javascript
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true
    // No enum - allows any notification type (apartment_booked, event_cancelled, join_request, etc.)
  },
  category: {
    type: String,
    enum: ["system", "booking", "social", "payment", "alert"],
    default: "system"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  
  // Generic reference fields - can point to any resource
  resourceType: {
    type: String,
    enum: ["Linkup", "Apartment", "Event", "Booking", "User", "JoinRequest"]
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    // Dynamic ref based on resourceType
  },
  
  // Optional metadata - flexible JSON for any notification type
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
    // Examples:
    // - For join_request: { requestId, requesterName, requesterPhoto, message }
    // - For apartment_booked: { apartmentId, checkIn, checkOut, price }
    // - For event_cancelled: { eventId, eventTitle, reason }
    // - For join_approved: { joinCode, expiresAt }
  },
  
  // Action data for interactive notifications
  actionRequired: {
    type: Boolean,
    default: false
  },
  actions: [{
    label: String,        // e.g., "Approve", "Reject", "View Details"
    actionType: String,   // e.g., "approve_request", "navigate", "api_call"
    actionData: mongoose.Schema.Types.Mixed  // Flexible data for the action
  }]
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ linkupId: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
```

## Notification Service (utils/notificationService.js)

```javascript
const Notification = require('../models/Notification');
const Linkup = require('../models/Linkup');
const PublicProfile = require('../models/PublicProfile');

/**
 * Send notification when user joins a public linkup
 */
async function sendUserJoinedNotification(linkupId, joiningUserId, joiningUserName) {
  try {
    const linkup = await Linkup.findById(linkupId).populate('createdBy');
    if (!linkup) {
      throw new Error('Linkup not found');
    }

    // Find host's user document
    const hostProfile = await PublicProfile.findById(linkup.createdBy);
    if (!hostProfile) {
      throw new Error('Host profile not found');
    }

    const notification = await Notification.create({
      userId: hostProfile.userId,
      title: 'New Member Joined',
      message: `${joiningUserName} has joined your linkup "${linkup.title}"`,
      type: 'user_joined',
      category: 'social',
      priority: 'medium',
      resourceType: 'Linkup',
      resourceId: linkupId,
      metadata: {
        joiningUserId,
        joiningUserName,
        linkupTitle: linkup.title
      },
      actionRequired: false,
      actions: [{
        label: 'View Linkup',
        actionType: 'navigate',
        actionData: { screen: 'linkup-details', linkupId }
      }]
    });

    return notification;
  } catch (error) {
    console.error('Error sending user joined notification:', error);
    throw error;
  }
}

/**
 * Send notification when user requests to join private linkup
 */
async function sendJoinRequestNotification(linkupId, requestId, requesterData) {
  try {
    const linkup = await Linkup.findById(linkupId).populate('createdBy');
    if (!linkup) {
      throw new Error('Linkup not found');
    }

    // Find host's user document
    const hostProfile = await PublicProfile.findById(linkup.createdBy);
    if (!hostProfile) {
      throw new Error('Host profile not found');
    }

    const notification = await Notification.create({
      userId: hostProfile.userId,
      title: 'Join Request',
      message: `${requesterData.userName} wants to join your private linkup "${linkup.title}"`,
      type: 'join_request',
      category: 'social',
      priority: 'high',
      resourceType: 'JoinRequest',
      resourceId: requestId,
      metadata: {
        linkupId,
        linkupTitle: linkup.title,
        requestId,
        requesterUserId: requesterData.userId,
        requesterName: requesterData.userName,
        requesterPhoto: requesterData.userPhoto,
        requesterMessage: requesterData.message
      },
      actionRequired: true,
      actions: [
        {
          label: 'Approve',
          actionType: 'approve_request',
          actionData: { linkupId, requestId }
        },
        {
          label: 'Reject',
          actionType: 'reject_request',
          actionData: { linkupId, requestId }
        }
      ]
    });

    return notification;
  } catch (error) {
    console.error('Error sending join request notification:', error);
    throw error;
  }
}

/**
 * Send notification with join code to approved user
 */
async function sendJoinApprovedNotification(linkupId, userId, joinCode) {
  try {
    const linkup = await Linkup.findById(linkupId);
    if (!linkup) {
      throw new Error('Linkup not found');
    }

    // Find user's profile to get their User ObjectId
    const userProfile = await PublicProfile.findOne({ uid: userId });
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const notification = await Notification.create({
      userId: userProfile.userId,
      title: 'Join Request Approved',
      message: `Your request to join "${linkup.title}" has been approved! Use the code below to join.`,
      type: 'join_approved',
      category: 'social',
      priority: 'high',
      resourceType: 'Linkup',
      resourceId: linkupId,
      metadata: {
        linkupId,
        linkupTitle: linkup.title,
        joinCode,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      actionRequired: true,
      actions: [
        {
          label: 'Copy Code',
          actionType: 'copy_to_clipboard',
          actionData: { text: joinCode }
        },
        {
          label: 'Join Now',
          actionType: 'navigate',
          actionData: { screen: 'linkup-details', linkupId, autoJoin: true }
        }
      ]
    });

    return notification;
  } catch (error) {
    console.error('Error sending join approved notification:', error);
    throw error;
  }
}

/**
 * Example: Send apartment booking notification
 */
async function sendApartmentBookingNotification(hostUserId, bookingData) {
  const notification = await Notification.create({
    userId: hostUserId,
    title: 'New Booking Request',
    message: `${bookingData.guestName} wants to book ${bookingData.apartmentName}`,
    type: 'booking_request',
    category: 'booking',
    priority: 'high',
    resourceType: 'Booking',
    resourceId: bookingData.bookingId,
    metadata: {
      apartmentId: bookingData.apartmentId,
      apartmentName: bookingData.apartmentName,
      guestName: bookingData.guestName,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      totalPrice: bookingData.totalPrice
    },
    actionRequired: true,
    actions: [
      { label: 'Accept', actionType: 'accept_booking', actionData: { bookingId: bookingData.bookingId } },
      { label: 'Decline', actionType: 'decline_booking', actionData: { bookingId: bookingData.bookingId } }
    ]
  });
  return notification;
}

/**
 * Example: Send event cancelled notification
 */
async function sendEventCancelledNotification(attendeeUserId, eventData) {
  const notification = await Notification.create({
    userId: attendeeUserId,
    title: 'Event Cancelled',
    message: `"${eventData.eventTitle}" has been cancelled by the host`,
    type: 'event_cancelled',
    category: 'alert',
    priority: 'urgent',
    resourceType: 'Event',
    resourceId: eventData.eventId,
    metadata: {
      eventId: eventData.eventId,
      eventTitle: eventData.eventTitle,
      reason: eventData.reason,
      refundAmount: eventData.refundAmount
    },
    actionRequired: false
  });
  return notification;
}

module.exports = {
  sendUserJoinedNotification,
  sendJoinRequestNotification,
  sendJoinApprovedNotification
};
```

## Updated Controllers

### linkupController.js - Join Public Linkup

```javascript
const { sendUserJoinedNotification } = require('../utils/notificationService');

/**
 * @route   POST /api/linkups/:id/join
 * @desc    Join a public linkup
 */
exports.joinLinkup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid; // Firebase UID from auth middleware

    const linkup = await Linkup.findById(id);
    if (!linkup) {
      return res.status(404).json({ message: "Linkup not found" });
    }

    // Check if linkup is private
    if (linkup.isPrivate || linkup.privacy === 'private') {
      return res.status(403).json({ 
        message: "This is a private linkup. Please send a join request instead." 
      });
    }

    // Check if user already joined
    if (linkup.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member" });
    }

    // Check group capacity
    if (linkup.groupSize?.max && linkup.members.length >= linkup.groupSize.max) {
      return res.status(400).json({ message: "Group is full" });
    }

    // Add user to members
    linkup.members.push(userId);
    linkup.groupSize.current = linkup.members.length;
    await linkup.save();

    // Get user profile for notification
    const userProfile = await PublicProfile.findOne({ uid: userId });
    const userName = userProfile?.firstName 
      ? `${userProfile.firstName} ${userProfile.lastName}` 
      : 'A user';

    // Send notification to host
    try {
      await sendUserJoinedNotification(linkup._id, userId, userName);
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
      // Don't fail the join if notification fails
    }

    res.status(200).json({
      success: true,
      message: "Successfully joined the linkup",
      linkup
    });
  } catch (error) {
    console.error("Error joining linkup:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

### linkupController.js - Send Join Request (Private Linkup)

```javascript
const JoinRequest = require('../models/JoinRequest');
const { sendJoinRequestNotification } = require('../utils/notificationService');

/**
 * @route   POST /api/linkups/:id/request
 * @desc    Request to join a private linkup
 */
exports.requestToJoinLinkup = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.uid; // Firebase UID

    const linkup = await Linkup.findById(id);
    if (!linkup) {
      return res.status(404).json({ message: "Linkup not found" });
    }

    // Check if linkup is private
    if (!linkup.isPrivate && linkup.privacy !== 'private') {
      return res.status(400).json({ 
        message: "This linkup is public. You can join directly." 
      });
    }

    // Check if user already joined
    if (linkup.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member" });
    }

    // Check for existing pending request
    const existingRequest = await JoinRequest.findOne({
      linkupId: id,
      userId: userId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: "You already have a pending request for this linkup" 
      });
    }

    // Get user profile data
    const userProfile = await PublicProfile.findOne({ uid: userId });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const userName = `${userProfile.firstName} ${userProfile.lastName}`;
    const userPhoto = userProfile.profilePicture || null;

    // Create join request
    const joinRequest = await JoinRequest.create({
      linkupId: id,
      userId: userId,
      userName: userName,
      userPhoto: userPhoto,
      message: message || '',
      status: 'pending'
    });

    // Send notification to linkup host
    try {
      await sendJoinRequestNotification(linkup._id, joinRequest._id, {
        userId,
        userName,
        userPhoto,
        message: message || ''
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      success: true,
      message: "Join request sent successfully",
      requestId: joinRequest._id
    });
  } catch (error) {
    console.error("Error requesting to join linkup:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

### linkupController.js - Approve Join Request

```javascript
const JoinCode = require('../models/JoinCode');
const { sendJoinApprovedNotification } = require('../utils/notificationService');

/**
 * Generate random 6-digit code
 */
function generateJoinCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * @route   POST /api/linkups/:id/approve-request
 * @desc    Approve a join request (admin/creator only)
 */
exports.approveJoinRequest = async (req, res) => {
  try {
    const { id } = req.params; // linkup ID
    const { requestId } = req.body;
    const adminUserId = req.user.uid; // Firebase UID

    const linkup = await Linkup.findById(id).populate('createdBy');
    if (!linkup) {
      return res.status(404).json({ message: "Linkup not found" });
    }

    // Get admin profile
    const adminProfile = await PublicProfile.findOne({ uid: adminUserId });
    if (!adminProfile) {
      return res.status(404).json({ message: "Admin profile not found" });
    }

    // Check if user is creator or admin
    const isCreator = linkup.createdBy._id.equals(adminProfile._id);
    const isAdmin = linkup.admins?.some(admin => admin.equals(adminProfile._id));

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ 
        message: "Only the creator or admins can approve requests" 
      });
    }

    // Find join request
    const joinRequest = await JoinRequest.findById(requestId);
    if (!joinRequest) {
      return res.status(404).json({ message: "Join request not found" });
    }

    if (!joinRequest.linkupId.equals(linkup._id)) {
      return res.status(400).json({ 
        message: "Request does not match this linkup" 
      });
    }

    if (joinRequest.status !== 'pending') {
      return res.status(400).json({ 
        message: `Request already ${joinRequest.status}` 
      });
    }

    // Generate 6-digit join code
    const code = generateJoinCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create join code
    const joinCode = await JoinCode.create({
      code: code,
      linkupId: linkup._id,
      userId: joinRequest.userId,
      expiresAt: expiresAt,
      used: false,
      createdBy: adminProfile._id
    });

    // Update request status
    joinRequest.status = 'approved';
    await joinRequest.save();

    // Send notification with code to requester
    try {
      await sendJoinApprovedNotification(
        linkup._id, 
        joinRequest.userId, 
        code
      );
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
      // Don't fail the approval if notification fails
    }

    res.status(200).json({
      success: true,
      message: "Request approved and code sent to user",
      joinCode: code // Also return to admin
    });
  } catch (error) {
    console.error("Error approving join request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

### linkupController.js - Join with Code

```javascript
/**
 * @route   POST /api/linkups/:id/join-with-code
 * @desc    Join a private linkup using one-time code
 */
exports.joinWithCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;
    const userId = req.user.uid; // Firebase UID

    if (!code || code.length !== 6) {
      return res.status(400).json({ message: "Invalid code format" });
    }

    const linkup = await Linkup.findById(id);
    if (!linkup) {
      return res.status(404).json({ message: "Linkup not found" });
    }

    // Find and validate code
    const joinCode = await JoinCode.findOne({
      code: code,
      linkupId: id,
      userId: userId,
      used: false
    });

    if (!joinCode) {
      return res.status(400).json({ 
        message: "Invalid or already used code" 
      });
    }

    // Check if code expired
    if (new Date() > joinCode.expiresAt) {
      return res.status(400).json({ message: "Code has expired" });
    }

    // Check if user already joined
    if (linkup.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member" });
    }

    // Check group capacity
    if (linkup.groupSize?.max && linkup.members.length >= linkup.groupSize.max) {
      return res.status(400).json({ message: "Group is full" });
    }

    // Add user to members
    linkup.members.push(userId);
    linkup.groupSize.current = linkup.members.length;
    await linkup.save();

    // Mark code as used
    joinCode.used = true;
    joinCode.usedAt = new Date();
    await joinCode.save();

    res.status(200).json({
      success: true,
      message: "Successfully joined the linkup",
      linkup
    });
  } catch (error) {
    console.error("Error joining with code:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

## Frontend Integration

### Notification Type Constants (Optional - for type safety)
```javascript
// constants/NotificationTypes.js
// These are just examples - your backend can send ANY type string
export const NOTIFICATION_TYPES = {
  // Linkup notifications
  JOIN_REQUEST: 'join_request',
  JOIN_APPROVED: 'join_approved',
  USER_JOINED: 'user_joined',
  LINKUP_UPDATED: 'linkup_updated',
  LINKUP_CANCELLED: 'linkup_cancelled',
  
  // Apartment notifications
  BOOKING_REQUEST: 'booking_request',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  APARTMENT_REVIEW: 'apartment_review',
  
  // Event notifications
  EVENT_REMINDER: 'event_reminder',
  EVENT_CANCELLED: 'event_cancelled',
  EVENT_UPDATED: 'event_updated',
  
  // Payment notifications
  PAYMENT_RECEIVED: 'payment_received',
  PAYOUT_PROCESSED: 'payout_processed',
  
  // System notifications
  SYSTEM_UPDATE: 'system_update',
  ACCOUNT_VERIFICATION: 'account_verification'
};

export const NOTIFICATION_CATEGORIES = {
  SYSTEM: 'system',
  BOOKING: 'booking',
  SOCIAL: 'social',
  PAYMENT: 'payment',
  ALERT: 'alert'
};
```

### Updated Notification Services
```javascript
// api/services/notificationServices.js
import api from '../api';

export const getNotifications = async (filters = {}) => {
  try {
    // Supports filtering by category, type, priority, unread, etc.
    const params = new URLSearchParams(filters);
    const response = await api.get(`/notifications?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const handleNotificationAction = async (action) => {
  try {
    const { actionType, actionData } = action;
    
    switch (actionType) {
      case 'approve_request':
        return await api.post(`/linkups/${actionData.linkupId}/approve-request`, {
          requestId: actionData.requestId
        });
      
      case 'reject_request':
        return await api.post(`/linkups/${actionData.linkupId}/reject-request`, {
          requestId: actionData.requestId
        });
      
      case 'accept_booking':
        return await api.post(`/bookings/${actionData.bookingId}/accept`);
      
      case 'decline_booking':
        return await api.post(`/bookings/${actionData.bookingId}/decline`);
      
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  } catch (error) {
    console.error('Error handling notification action:', error);
    throw error;
  }
};
```

### Dynamic Notification Icon Handler
```javascript
// utils/notificationHelpers.js
import { Bell, CheckCircle, User, Users, Home, Calendar, DollarSign, AlertCircle } from 'lucide-react-native';

export const getNotificationIcon = (notification) => {
  // Can use type, category, or both
  switch (notification.category) {
    case 'social':
      return notification.type === 'join_request' ? User : Users;
    case 'booking':
      return Home;
    case 'payment':
      return DollarSign;
    case 'alert':
      return AlertCircle;
    default:
      return Bell;
  }
};

export const getNotificationColor = (notification) => {
  switch (notification.priority) {
    case 'urgent':
      return '#EF4444'; // Red
    case 'high':
      return '#F59E0B'; // Orange
    case 'medium':
      return '#3B82F6'; // Blue
    case 'low':
      return '#6B7280'; // Gray
    default:
      return '#3B82F6';
  }
};

export const formatNotificationTime = (timestamp) => {
  const now = new Date();
  const notifTime = new Date(timestamp);
  const diffMs = now - notifTime;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return notifTime.toLocaleDateString();
};
```

### Updated Notification List Component
```javascript
// app/(screens)/notification/index.jsx
import { getNotificationIcon, getNotificationColor, formatNotificationTime } from '@/utils/notificationHelpers';

const renderNotification = ({ item }) => {
  const Icon = getNotificationIcon(item);
  const iconColor = getNotificationColor(item);
  
  return (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}
      onPress={() => router.push({
        pathname: '/(screens)/notification/[id]',
        params: { notification: JSON.stringify(item) }
      })}
    >
      <View style={styles.iconContainer}>
        <Icon size={24} color={iconColor} />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {item.actionRequired && (
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeText}>Action Required</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        
        <View style={styles.notificationFooter}>
          <Text style={styles.notificationTime}>
            {formatNotificationTime(item.createdAt)}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
      </View>
      
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};
```

## Routes to Add

```javascript
// routes/linkupRoutes.js
router.post('/:id/join', protect, linkupController.joinLinkup);
router.post('/:id/request', protect, linkupController.requestToJoinLinkup);
router.post('/:id/approve-request', protect, linkupController.approveJoinRequest);
router.post('/:id/reject-request', protect, linkupController.rejectJoinRequest);
router.post('/:id/join-with-code', protect, linkupController.joinWithCode);
```

```javascript
// routes/notificationRoutes.js
router.get('/', protect, notificationController.getNotifications);
router.put('/:id/read', protect, notificationController.markAsRead);
router.delete('/:id', protect, notificationController.deleteNotification);
```

## Testing Flow

1. **Public Linkup Join:**
   - User clicks "Join Group"
   - POST /linkups/:id/join
   - Host receives "user_joined" notification

2. **Private Linkup Request:**
   - User clicks "Join Group" → "Send Request"
   - POST /linkups/:id/request
   - Host receives "join_request" notification with approve/reject actions

3. **Approve Request:**
   - Host clicks "Approve" in notification
   - POST /linkups/:id/approve-request
   - System generates 6-digit code
   - User receives "join_approved" notification with code

4. **Join with Code:**
   - User sees code in notification
   - Enters code in app
   - POST /linkups/:id/join-with-code
   - User joins linkup
   - Code marked as used
