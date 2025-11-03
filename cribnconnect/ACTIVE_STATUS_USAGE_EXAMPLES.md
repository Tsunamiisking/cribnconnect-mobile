# Active Status - Usage Examples

## ✅ Setup Complete!

Your app is now configured with:
1. ✅ Heartbeat hook in `app/_layout.jsx` - automatically sends status updates every 3 minutes
2. ✅ Backend endpoints ready and tested
3. ✅ UI components and utilities created

## 📖 Real-World Usage Examples

### Example 1: Show Active Status on User Profile

```javascript
// app/(screens)/profile/[id].jsx
import { ActiveStatusIndicator } from '@/components/ActiveStatusIndicator';
import { useActiveStatus } from '@/hooks/useActiveStatus';

export default function UserProfile() {
  const { id } = useLocalSearchParams(); // User's Firebase UID
  const { isOnline, lastSeen, loading } = useActiveStatus(id);
  
  return (
    <View>
      <Image source={{ uri: user.avatar }} />
      <Text>{user.username}</Text>
      
      {/* Show active status */}
      {!loading && (
        <ActiveStatusIndicator 
          lastSeen={lastSeen} 
          isOnline={isOnline} 
        />
      )}
    </View>
  );
}
```

### Example 2: Add Status Dot to Avatar (Messages/Chat List)

```javascript
// components/ChatListItem.jsx
import { ActiveStatusDot } from '@/components/ActiveStatusIndicator';
import { isUserOnline } from '@/utils/activeStatusUtils';

export default function ChatListItem({ user }) {
  const online = isUserOnline(user.lastSeen);
  
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        
        {/* Status dot overlay on avatar */}
        <ActiveStatusDot 
          isOnline={online} 
          size="small" 
          style={styles.statusDot} 
        />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.message}>{lastMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
});
```

### Example 3: Show Active Members in Linkup Card

```javascript
// components/LinkupCard.jsx
import { GroupActiveCount } from '@/components/ActiveStatusIndicator';
import { useGroupActiveMembers } from '@/hooks/useActiveStatus';

export default function LinkupCard({ linkup }) {
  // Enable polling to get real-time updates
  const { activeCount, loading } = useGroupActiveMembers(linkup._id, true);
  
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: linkup.photo?.url }} style={styles.image} />
      
      <View style={styles.info}>
        <Text style={styles.name}>{linkup.name}</Text>
        <Text style={styles.description}>{linkup.description}</Text>
        
        {/* Show active member count */}
        {!loading && (
          <GroupActiveCount 
            count={activeCount} 
            total={linkup.members.length} 
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
```

### Example 4: Simple Text Status (No Components)

```javascript
// Any component
import { getStatusText, isUserOnline } from '@/utils/activeStatusUtils';

function UserInfo({ user }) {
  const statusText = getStatusText(user.lastSeen);
  const online = isUserOnline(user.lastSeen);
  
  return (
    <View>
      <Text>{user.username}</Text>
      <Text style={{ color: online ? 'green' : 'gray' }}>
        {statusText}
      </Text>
    </View>
  );
}
```

### Example 5: Nearby People with Active Status

```javascript
// app/(screens)/nearby-people/index.jsx
import { ActiveStatusIndicator } from '@/components/ActiveStatusIndicator';

export default function NearbyPeople() {
  const [people, setPeople] = useState([]);
  
  // Fetch nearby people from your API
  // They already have lastSeen field from backend
  
  return (
    <FlatList
      data={people}
      renderItem={({ item }) => (
        <View style={styles.personCard}>
          <Image source={{ uri: item.images?.[0]?.url }} />
          <Text>{item.username}</Text>
          
          {/* Show their active status */}
          <ActiveStatusIndicator 
            lastSeen={item.lastSeen}
            showDot={true}
            showText={true}
          />
        </View>
      )}
    />
  );
}
```

### Example 6: Custom Styling

```javascript
import { ActiveStatusIndicator } from '@/components/ActiveStatusIndicator';

// Just the dot, no text
<ActiveStatusIndicator 
  lastSeen={user.lastSeen} 
  showText={false} 
  dotSize="large"
/>

// Just the text, no dot
<ActiveStatusIndicator 
  lastSeen={user.lastSeen} 
  showDot={false}
/>

// Custom style
<ActiveStatusIndicator 
  lastSeen={user.lastSeen} 
  style={{ marginTop: 8 }}
/>
```

## 🎯 Component Props Reference

### `<ActiveStatusIndicator />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lastSeen` | Date/string | required | User's last seen timestamp |
| `isOnline` | boolean | null | Optional explicit online status |
| `showText` | boolean | true | Show status text |
| `showDot` | boolean | true | Show status dot |
| `dotSize` | 'small'\|'medium'\|'large' | 'medium' | Size of the dot |
| `style` | object | - | Custom container styles |

### `<ActiveStatusDot />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOnline` | boolean | required | Whether user is online |
| `size` | 'small'\|'medium'\|'large' | 'medium' | Dot size |
| `style` | object | - | Custom styles |

### `<GroupActiveCount />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | number | required | Active members count |
| `total` | number | - | Total members (optional) |
| `style` | object | - | Custom styles |

## 🔧 Utility Functions

### `isUserOnline(lastSeen)`
Returns `true` if user was active within last 5 minutes

```javascript
import { isUserOnline } from '@/utils/activeStatusUtils';

const online = isUserOnline(user.lastSeen); // true or false
```

### `getStatusText(lastSeen, isOnline)`
Returns human-readable status text

```javascript
import { getStatusText } from '@/utils/activeStatusUtils';

const text = getStatusText(user.lastSeen); 
// Returns: "Active now" | "Active 5m ago" | "Active 2h ago" | etc.
```

### `formatLastSeen(lastSeen)`
Simple formatter for lists

```javascript
import { formatLastSeen } from '@/utils/activeStatusUtils';

const text = formatLastSeen(user.lastSeen);
// Returns: "Online" | "5m ago" | "2h ago" | "Never"
```

## 🚀 Testing Your Implementation

1. **Start your app** - Heartbeat will automatically begin
2. **Check console** - You should see "Heartbeat sent successfully" every 3 minutes
3. **Open another user's profile** - You should see their active status
4. **Wait 5+ minutes** - User should show as offline
5. **Open the app again** - User becomes online immediately

## 💡 Tips

- The heartbeat **automatically pauses** when app goes to background
- The heartbeat **automatically resumes** when app comes to foreground
- Users are considered "online" if `lastSeen` is within **5 minutes**
- Backend cleanup job runs every **10 minutes** to mark inactive users offline
- No need to manually call anything - it's all automatic!

## 🐛 Troubleshooting

**Heartbeat not working?**
- Check if user is authenticated
- Check console for errors
- Verify backend endpoint is accessible

**Status always shows offline?**
- Check if backend cleanup job is running
- Verify user's `lastSeen` field is being updated
- Check if 5-minute threshold is correct for your use case

**Status not updating?**
- Enable polling: `useActiveStatus(userId, true)` (second parameter)
- Consider implementing WebSocket for real-time updates (future enhancement)
