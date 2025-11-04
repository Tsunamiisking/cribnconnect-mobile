# Join Flow Implementation

## Overview
Implemented a secure and user-friendly join flow for linkup groups with different behaviors for public and private groups.

## Public Groups Join Flow

### User Experience
1. User clicks "Join Group" button
2. Confirmation modal appears with:
   - Group name: "Join '[Group Name]'?"
   - Disclaimer text: "You're about to join this public group. Please be respectful and follow the group guidelines."
   - Cancel button
   - "Join Group" button

3. On confirmation:
   - API call: `POST /linkups/:id/join`
   - User added to Firebase group chat
   - System message posted: "User joined the group"
   - UI updates to show "Joined ✓"

### Benefits
- Prevents accidental joins
- Sets expectations about group behavior
- One-click join after confirmation

## Private Groups Join Flow

### Request Flow
1. User clicks "Join Group" button
2. Request modal appears with:
   - Title: "Request to Join"
   - Subtitle: "This is a private group. Send a request to the group admin."
   - Optional message input field
   - Cancel button
   - "Send Request" button
   - Link: "Already have a code? Enter it here"

3. On submit:
   - API call: `POST /linkups/:id/request`
   - Request data includes:
     - `message`: Optional user message
     - `userId`: Current user's Firebase UID
     - `userName`: Display name
     - `userPhoto`: Profile photo URL
   - Success message shown
   - UI updates to show "Request Sent ✓"

### Approval Flow (Backend Required)
1. Admin receives notification (type: `join_request`)
2. Admin views request in notifications screen
3. Admin clicks "Approve" button
4. Backend generates 6-digit one-time code
5. Backend sends code to requesting user (via notification)
6. Backend marks code as valid for 24 hours

### Code Entry Flow
1. User receives notification with join code
2. User clicks "Enter Code" or link in request modal
3. Code entry modal appears:
   - Title: "Enter Join Code"
   - Subtitle: "Enter the 6-digit code you received from the group admin."
   - Numeric input field (6 digits)
   - Cancel button
   - "Verify & Join" button (disabled until 6 digits entered)

4. On submit:
   - API call: `POST /linkups/:id/join-with-code`
   - Request body: `{ code: "123456" }`
   - Code validated and marked as used
   - User added to group members
   - User added to Firebase group chat
   - System message posted
   - UI updates to show "Joined ✓"

## Implementation Details

### Frontend Components

#### State Variables
```javascript
const [joinModalVisible, setJoinModalVisible] = useState(false);
const [joinCodeModalVisible, setJoinCodeModalVisible] = useState(false);
const [requestMessage, setRequestMessage] = useState("");
const [joinCode, setJoinCode] = useState("");
const [requestSent, setRequestSent] = useState(false);
const [joinError, setJoinError] = useState("");
const [hasJoined, setHasJoined] = useState(false);
```

#### Key Functions
- `handleJoinGroup()` - Determines which modal to show based on privacy
- `handleConfirmPublicJoin()` - Handles public group join after confirmation
- `handleSubmitRequest()` - Sends join request for private groups
- `handleJoinWithCode()` - Validates and joins with one-time code
- `handleEnterCode()` - Opens code entry modal

### Backend Endpoints Required

#### 1. POST /linkups/:id/join
Existing endpoint for public group joins.

**Request:**
```
POST /linkups/507f1f77bcf86cd799439011/join
Authorization: Bearer <firebase-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined the group",
  "linkup": { ... }
}
```

#### 2. POST /linkups/:id/request
New endpoint for private group join requests.

**Request:**
```
POST /linkups/507f1f77bcf86cd799439011/request
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "message": "I'm interested in joining because...",
  "userId": "firebase-uid-123",
  "userName": "John Doe",
  "userPhoto": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Join request sent successfully",
  "requestId": "req_123456"
}
```

**Backend Actions:**
- Store request in database
- Create notification for group creator/admins
- Notification type: `join_request`
- Include linkup ID, user details, message

#### 3. POST /linkups/:id/approve-request
New endpoint for admins to approve requests.

**Request:**
```
POST /linkups/507f1f77bcf86cd799439011/approve-request
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "requestId": "req_123456",
  "userId": "firebase-uid-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request approved",
  "joinCode": "849201"
}
```

**Backend Actions:**
- Verify requester is admin/creator
- Generate 6-digit random code
- Store code with expiry (24 hours)
- Link code to specific user and linkup
- Create notification for requesting user with code
- Mark original request as approved

#### 4. POST /linkups/:id/join-with-code
New endpoint for joining with one-time code.

**Request:**
```
POST /linkups/507f1f77bcf86cd799439011/join-with-code
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "code": "849201"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined the group",
  "linkup": { ... }
}
```

**Backend Actions:**
- Validate code exists and not expired
- Verify code matches current user
- Verify code is for this linkup
- Add user to linkup members
- Mark code as used (prevent reuse)
- Return linkup data

### Database Schema Updates

#### JoinRequest Collection
```javascript
{
  _id: ObjectId,
  linkupId: ObjectId,
  userId: String,          // Firebase UID
  userName: String,
  userPhoto: String,
  message: String,
  status: String,          // "pending", "approved", "rejected"
  createdAt: Date,
  updatedAt: Date
}
```

#### JoinCode Collection
```javascript
{
  _id: ObjectId,
  code: String,            // 6-digit code
  linkupId: ObjectId,
  userId: String,          // Firebase UID who can use it
  expiresAt: Date,
  used: Boolean,
  usedAt: Date,
  createdBy: ObjectId,     // Admin who created it
  createdAt: Date
}
```

#### Notification Updates
Add new notification type:
```javascript
{
  type: "join_request",
  linkupId: ObjectId,
  requesterId: String,     // Firebase UID
  requesterName: String,
  requesterPhoto: String,
  message: String,
  // ... standard notification fields
}
```

And:
```javascript
{
  type: "join_approved",
  linkupId: ObjectId,
  joinCode: String,
  expiresAt: Date,
  // ... standard notification fields
}
```

## UI/UX Features

### Error Handling
- Invalid code: "Invalid or expired code"
- Network errors: "Failed to send request"
- Auto-dismiss errors after 3 seconds

### Loading States
- Disabled button during API calls
- Success states with checkmarks
- Auto-close modals after success

### Input Validation
- Code must be exactly 6 digits
- Submit button disabled until valid
- Numeric keypad for code entry

### Visual Feedback
- "Join Group" → "Request Sent ✓" → "Joined ✓"
- Color coding: Primary (join) → Amber (pending) → Emerald (joined)
- Modal animations (fade in/out)

## Security Considerations

### One-Time Codes
- 6 digits (1 million combinations)
- 24-hour expiry
- Single use only
- User-specific (can't share)
- Linked to specific linkup

### Authorization
- Only admins can approve requests
- Only code recipient can use code
- Expired codes rejected
- Used codes cannot be reused

### Privacy
- Private group members hidden from non-members
- Request messages only visible to admins
- Codes never displayed in UI after initial send

## Next Steps

### Backend Implementation
1. Create `POST /linkups/:id/request` endpoint
2. Create `POST /linkups/:id/approve-request` endpoint
3. Create `POST /linkups/:id/join-with-code` endpoint
4. Add JoinRequest model
5. Add JoinCode model
6. Update Notification model with new types
7. Implement code generation logic
8. Add expiry checking middleware

### Frontend Integration
1. Update notification screen to handle `join_request` type
2. Add approve/reject buttons to notification details
3. Display generated code to admin
4. Show code in notification for approved users
5. Add notification badge for pending requests

### Testing
1. Test public join confirmation flow
2. Test private request submission
3. Test admin approval process
4. Test code generation and validation
5. Test code expiry
6. Test error cases (invalid code, expired code, used code)
7. Test Firebase chat integration for both flows

## Files Modified

### `app/(screens)/linkup-details/[id].jsx`
- Added state variables for modals and code entry
- Implemented `handleJoinGroup()` to route to correct flow
- Implemented `handleConfirmPublicJoin()` for public groups
- Implemented `handleSubmitRequest()` for private requests
- Implemented `handleJoinWithCode()` for code verification
- Implemented `handleEnterCode()` to open code modal
- Added two modal components (join/request and code entry)
- Added modal styles

### Key Changes
- Public groups: Added confirmation step before join
- Private groups: Send request instead of immediate join
- Added code entry flow for approved requests
- Added error handling and success states
- Added link to code entry from request modal
