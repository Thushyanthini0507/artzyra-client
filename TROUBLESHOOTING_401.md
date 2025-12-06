# Troubleshooting 401 Unauthorized Errors

## Problem
Getting 401 Unauthorized errors when making API requests to your external backend on port 5000.

## Common Causes

### 1. Token Not Being Sent
The token might not be getting sent with the request. Check the browser console for:
- "Axios Interceptor - Token from cookie: Found" or "Missing"
- "Axios Interceptor - Authorization header set"

### 2. Backend Not Reading Authorization Header
Your backend needs to read the `Authorization` header. Make sure your backend middleware extracts the token like this:

**Express.js Example:**
```javascript
// Middleware to extract token from Authorization header
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Use middleware
app.get('/api/admin/pending/artists', authenticateToken, (req, res) => {
  // Your route handler
});
```

### 3. CORS Configuration
Your backend must allow credentials and the Authorization header:

**Express.js CORS Example:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
}));
```

### 4. Token Format Mismatch
The frontend sends: `Authorization: Bearer <token>`

Make sure your backend:
- Expects the token in the format `Bearer <token>`
- Splits the header correctly: `authHeader.split(' ')[1]`

### 5. JWT Secret Mismatch
The JWT_SECRET used to sign the token (in frontend/Next.js) must match the JWT_SECRET used to verify (in backend).

**Frontend/Next.js:**
```javascript
const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
  expiresIn: "7d",
});
```

**Backend:**
```javascript
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  // ...
});
```

Both must use the **same** JWT_SECRET value.

## Debugging Steps

### Step 1: Check Browser Console (Enhanced Logging)
Open browser DevTools (F12) → Console tab. You should now see detailed logs:

**Request Interceptor Logs (🔵 Blue):**
- Shows if token was found in cookies
- Shows the Authorization header being set
- Shows all request headers being sent

**Response Error Logs (🔴 Red):**
- Detailed error information
- Shows what headers were actually sent
- Shows backend response data
- Provides specific troubleshooting steps for 401 errors

Look for:
- `🔵 Axios Request Interceptor` - Shows token status and headers
- `🔴 Axios Response Error` - Shows detailed error information
- Any 401 error with analysis of possible causes

### Step 2: Check Network Tab
Open DevTools → Network tab:
1. Find the failed request (e.g., `/api/admin/pending/artists`)
2. Click on it
3. Check **Request Headers**:
   - Should see: `Authorization: Bearer <token>`
   - If missing, the token wasn't sent (check cookie)
   - If present but still 401, backend might not be reading it correctly
4. Check **Response**:
   - Status: 401
   - Response body might have error details like: `{success: false, message: 'Not authorized. No token provided.'}`
5. Check **Request Payload** (if POST/PUT):
   - Verify data is being sent correctly

### Step 3: Check Backend Logs
Check your backend server console for:
- Authentication middleware logs
- Token verification errors
- Any error messages

### Step 4: Verify Token in Browser
In browser console, run:
```javascript
document.cookie
// Should show: token=<your-token>
```

Or check in Application/Storage tab:
- Cookies → `http://localhost:3000` → Look for `token`

### Step 5: Test Token Manually
You can test if your backend accepts the token:

```javascript
// In browser console
const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

fetch('http://localhost:5000/api/admin/pending/artists', {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Quick Fixes

### Fix 1: Ensure Token is Set After Login
After successful login, verify the token cookie is set:
```javascript
// In auth-context.tsx, after login:
Cookies.set("token", token, { expires: 7, path: "/" });
console.log("Token set:", Cookies.get("token") ? "YES" : "NO");
```

### Fix 2: Add Token Refresh
If token expires, implement token refresh:
```javascript
// In axios interceptor
if (error.response?.status === 401) {
  // Try to refresh token or redirect to login
  window.location.href = "/auth/login";
}
```

### Fix 3: Verify Backend Endpoint
Make sure your backend has the endpoint:
- `GET /api/admin/pending/artists`
- Protected with authentication middleware
- Returns data in expected format

## Backend Authentication Middleware Template

Here's a complete example for Express.js:

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    console.log('[Auth] No token provided');
    return res.status(401).json({ 
      success: false,
      error: 'Access token required' 
    });
  }
  
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('[Auth] Token verification failed:', err.message);
      return res.status(403).json({ 
        success: false,
        error: 'Invalid or expired token' 
      });
    }
    
    console.log('[Auth] Token verified. User:', decoded.userId, 'Role:', decoded.role);
    req.user = decoded;
    next();
  });
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      error: 'Admin access required' 
    });
  }
};

// Use in routes
app.get('/api/admin/pending/artists', authenticateToken, requireAdmin, async (req, res) => {
  // Your route handler
  const artists = await User.find({ role: 'artist', status: 'pending' });
  res.json({ success: true, data: artists });
});
```

## Understanding the Enhanced Logs

The new logging system provides detailed information:

### Request Interceptor (🔵)
- **Token in cookie**: Shows if token exists and its length
- **Authorization header set**: Confirms if header was added
- **Request headers**: Shows all headers being sent

### Response Error (🔴)
- **401 Analysis**: Provides specific reasons why 401 occurred:
  - Token format mismatch
  - JWT_SECRET mismatch
  - Token expired
  - Backend middleware issue
  - CORS issue

### What to Look For

1. **If token is missing in request:**
   - Check: `Token in cookie: ❌ MISSING`
   - Solution: User needs to login again

2. **If token is present but 401:**
   - Check: `Authorization header sent: ✅ Yes` but still 401
   - Solution: Backend authentication middleware issue

3. **If CORS error:**
   - Check: Network tab shows CORS error
   - Solution: Update backend CORS configuration

## Still Having Issues?

1. **Check JWT_SECRET**: Ensure both frontend and backend use the same secret
2. **Check Token Expiry**: Tokens expire after 7 days, user needs to login again
3. **Check CORS**: Backend must allow `Authorization` header
4. **Check Backend Logs**: Look for authentication errors in backend console
5. **Test with Postman/curl**: Verify backend works independently

```bash
# Test with curl (replace YOUR_TOKEN_HERE with actual token from browser cookie)
curl -X GET http://localhost:5000/api/admin/pending/artists \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Quick Test in Browser Console

```javascript
// Get token from cookie
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1];

console.log('Token:', token ? token.substring(0, 30) + '...' : 'NOT FOUND');

// Test API call
if (token) {
  fetch('http://localhost:5000/api/admin/pending/artists', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => console.log('Response:', data))
  .catch(err => console.error('Error:', err));
}
```

