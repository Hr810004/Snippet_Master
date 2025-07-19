# Snippet_Master API Documentation

## Real-Time Features

### WebSocket Events

#### Client to Server Events:
- `join-public-room` - Join the public snippets room
- `join-user-room` - Join user's personal room (with userId)
- `snippet-created` - Emit when snippet is created

#### Server to Client Events:
- `new-snippet` - Broadcast new snippet to all users
- `snippet-liked` - Broadcast snippet like updates

### Real-Time Implementation

**Backend Setup:**
- Socket.IO server running on the same port as Express
- Public room: `"public-snippets"` for all users
- User rooms: `"user-{userId}"` for personal notifications

**Frontend Setup:**
- Real-time context manages Socket.IO connections
- Automatic connection to public room
- Event listeners for live updates

## AI Features

### Endpoints

#### 1. Analyze Code
```
POST /api/v1/analyze-code
Content-Type: application/json
Authorization: Required

Body:
{
  "code": "string",
  "language": "string"
}

Response:
{
  "analysis": "string",
  "model": "gpt-3.5-turbo"
}
```

#### 2. Suggest Improvements
```
POST /api/v1/suggest-improvements
Content-Type: application/json
Authorization: Required

Body:
{
  "code": "string",
  "language": "string",
  "specificIssue": "string" (optional)
}

Response:
{
  "suggestions": "string",
  "model": "gpt-3.5-turbo"
}
```

#### 3. Generate Documentation
```
POST /api/v1/generate-documentation
Content-Type: application/json
Authorization: Required

Body:
{
  "code": "string",
  "language": "string"
}

Response:
{
  "documentation": "string",
  "model": "gpt-3.5-turbo"
}
```

## Environment Variables

### Backend (.env)
```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Live Updates Flow

1. **User creates snippet** → Backend saves to database
2. **Backend emits** → `new-snippet` event to public room
3. **All connected clients** → Receive the event
4. **Frontend updates** → Adds new snippet to the top of the list
5. **Toast notification** → Shows "New snippet: [title]"

## Features Summary

### ✅ Implemented
- **Real-time snippet creation** - Live updates when anyone adds a snippet
- **Connection status indicator** - Shows Live/Offline status
- **AI code analysis** - Analyze code quality and suggestions
- **Toast notifications** - Real-time alerts for new snippets

### 🔧 Technical Stack
- **Backend**: Node.js, Express, Socket.IO, OpenAI
- **Frontend**: Next.js, React, Socket.IO Client
- **Database**: MongoDB
- **Real-time**: WebSocket connections
- **AI**: OpenAI GPT-3.5-turbo

### 🚀 How to Test
1. Open the app in multiple browser tabs
2. Create a snippet in one tab
3. Watch it appear instantly in other tabs
4. Check the "Live" indicator in the header
5. Visit a snippet detail page to test AI analysis 