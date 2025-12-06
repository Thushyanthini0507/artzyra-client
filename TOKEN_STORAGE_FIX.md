# Token Storage Fix - Debugging Guide

## Problem
The token is not being stored in cookies after login, causing 401 Unauthorized errors.

## Changes Made

### 1. Enhanced Login Logging (`src/contexts/auth-context.tsx`)
- Added detailed logging to see exactly what the backend returns
- Logs the full response structure
- Shows where the token is being looked for
- Verifies token was actually stored

### 2. localStorage Fallback (`src/contexts/auth-context.tsx` & `src/lib/api/axios.ts`)
- If cookies fail, token is stored in localStorage
- Axios interceptor checks both cookies and localStorage
- Automatically syncs localStorage token back to cookies

### 3. Improved Token Extraction (`src/contexts/auth-context.tsx`)
- Checks multiple possible locations for the token:
  - `response.data.token`
  - `response.data.accessToken`
  - `response.data.authToken`
  - `response.token`
  - `response.accessToken`
  - `response.authToken`

## Next Steps - Debugging

### Step 1: Check Backend Login Response
When you log in, check the browser console for logs starting with `🔵 AuthContext`:

```
🔵 AuthContext - Starting login...
🔵 AuthContext - Login response: { ... }
🔵 AuthContext - Token found: ✅ Yes or ❌ No
```

**What to look for:**
- Does the backend return a token?
- Where is the token located in the response?
- What is the exact structure of the response?

### Step 2: Verify Token Storage
After login, check:
- Console log: `🔵 AuthContext - Token cookie verification: ✅ Set` or `❌ NOT SET`
- Browser DevTools → Application → Cookies → `http://localhost:3000` → Look for `token`
- Browser DevTools → Application → Local Storage → `http://localhost:3000` → Look for `token`

### Step 3: Check Backend Response Format
Your backend login endpoint (`POST /api/auth/login`) should return one of these formats:

**Option 1:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "your-jwt-token-here"
  }
}
```

**Option 2:**
```json
{
  "success": true,
  "token": "your-jwt-token-here",
  "user": { ... }
}
```

**Option 3:**
```json
{
  "token": "your-jwt-token-here",
  "user": { ... }
}
```

### Step 4: Test Token Storage Manually
If the token is still not being stored, you can test manually in the browser console:

```javascript
// After logging in, check what the backend returned
// Then manually set the token:
import Cookies from 'js-cookie';
const token = "YOUR_TOKEN_HERE";
Cookies.set("token", token, { expires: 7, path: "/", sameSite: "lax" });
localStorage.setItem("token", token);

// Verify it was set:
console.log("Cookie:", Cookies.get("token"));
console.log("LocalStorage:", localStorage.getItem("token"));
```

## Common Issues

### Issue 1: Backend Not Returning Token
**Symptom:** Console shows `🔵 AuthContext - Token found: ❌ No`

**Solution:** Check your backend login route. It must return a token in the response.

**Backend Example (Express.js):**
```javascript
app.post('/api/auth/login', async (req, res) => {
  // ... validate credentials ...
  
  // Generate token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Return token in response
  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token: token  // ← Make sure token is included!
    }
  });
});
```

### Issue 2: Cookie Blocked by Browser
**Symptom:** Token exists in localStorage but not in cookies

**Solution:** 
- Check browser settings (not blocking cookies)
- Check if you're in incognito/private mode
- The localStorage fallback should work, but cookies are preferred

### Issue 3: Token in Different Location
**Symptom:** Backend returns token but frontend can't find it

**Solution:** Check the console logs to see the exact response structure, then update the token extraction in `auth-context.tsx` if needed.

## Testing

1. **Clear all storage:**
   ```javascript
   // In browser console
   document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"));
   localStorage.clear();
   ```

2. **Login again** and watch the console logs

3. **Check token storage:**
   - Cookies: `document.cookie`
   - LocalStorage: `localStorage.getItem("token")`

4. **Try accessing admin page** - should work if token is stored

## Still Not Working?

If the token is still not being stored:

1. **Share the console logs** from login (especially the `🔵 AuthContext` logs)
2. **Share your backend login route code** (the part that returns the response)
3. **Check browser console for any cookie-related errors**

The enhanced logging will show exactly what's happening and where the token should be coming from.



