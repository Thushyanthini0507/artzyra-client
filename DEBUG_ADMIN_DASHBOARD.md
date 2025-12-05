# Debugging Admin Dashboard Data Issue

## Problem
Backend data is not showing in the admin dashboard (all values showing as 0).

## Debugging Steps

### 1. Check Browser Console
Open your browser's developer console (F12) and look for these logs:

**Expected logs:**
- `[Admin Dashboard] Starting to fetch stats...`
- `[nextApi] Making request to: /api/admin/dashboard/status`
- `[nextApi] Response status: 200 for /api/admin/dashboard/status`
- `[nextApi] Success response from /api/admin/dashboard/status: {...}`
- `[Admin Dashboard] Full response: {...}`
- `[Admin Dashboard] Setting stats: {...}`

**If you see errors:**
- `401 Unauthorized` → Authentication issue (not logged in as admin)
- `500 Internal Server Error` → Server-side error (check server logs)
- `Network error` → Connection issue

### 2. Check Server Console
Look at your Next.js server terminal for these logs:

**Expected logs:**
- `[Admin Dashboard] Checking admin authorization...`
- `[isAdmin] Starting admin check...`
- `[isAdmin] ✅ User IS admin!`
- `[Admin Dashboard] Admin authorized, fetching stats...`
- `[Admin Dashboard] Database connected`
- `[Admin Dashboard] Stats fetched: { totalCustomers: X, ... }`

**If you see errors:**
- `[isAdmin] No token found` → Not logged in
- `[isAdmin] User is not admin, role: customer` → Wrong user role
- Database connection errors → MongoDB connection issue

### 3. Check Network Tab
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Refresh the admin dashboard page
4. Look for request to `/api/admin/dashboard/status`
5. Check:
   - **Status Code**: Should be `200` (not 401 or 500)
   - **Request Headers**: Should include `Cookie: token=...`
   - **Response**: Click on the request and check the "Response" tab

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 5,
    "totalArtists": 3,
    "pendingArtists": 1,
    "totalBookings": 10,
    "pendingBookings": 2
  }
}
```

### 4. Common Issues and Fixes

#### Issue 1: 401 Unauthorized
**Symptoms:** Console shows `401` status, server logs show "Unauthorized"

**Causes:**
- Not logged in
- Token expired
- Wrong user role

**Fix:**
1. Log out and log back in as admin
2. Check that you're using: `admin@artzyra.com` / `admin123`
3. Verify the token cookie exists in browser DevTools → Application → Cookies

#### Issue 2: 500 Internal Server Error
**Symptoms:** Console shows `500` status, server logs show error

**Causes:**
- MongoDB connection issue
- Missing Booking model
- Database query error

**Fix:**
1. Check MongoDB connection string in `.env.local`
2. Verify `MONGO_URI` is correct
3. Check server logs for specific error message

#### Issue 3: Data is 0 but API returns correct data
**Symptoms:** Network tab shows correct data, but dashboard shows 0

**Causes:**
- Response structure mismatch
- Frontend not extracting data correctly

**Fix:**
1. Check browser console for `[Admin Dashboard] Full response:` log
2. Verify the response structure matches what the frontend expects
3. Check if `response.success` is `true` and `response.data` exists

#### Issue 4: Network Error / CORS Error
**Symptoms:** Console shows "Network error" or CORS error

**Causes:**
- Wrong API URL
- Server not running
- CORS configuration issue

**Fix:**
1. Verify `.env.local` has `NEXT_PUBLIC_API_URL=` (empty, not `http://localhost:5000`)
2. Restart the Next.js dev server
3. Check that the server is running on the correct port

### 5. Manual Test

Test the API endpoint directly:

```bash
# Get your token from browser cookies first, then:
curl -X GET http://localhost:3000/api/admin/dashboard/status \
  -H "Cookie: token=YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

Or use browser console:
```javascript
fetch('/api/admin/dashboard/status', {
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

### 6. Verify Database Has Data

If all API calls work but data is 0, check if your database actually has data:

```bash
# Connect to MongoDB and check:
# - Users collection has documents with role: "customer" or "artist"
# - Bookings collection has documents
```

## Next Steps

After checking all the above:

1. **Share the console logs** (both browser and server)
2. **Share the Network tab response** for `/api/admin/dashboard/status`
3. **Share any error messages** you see

This will help identify the exact issue.




