# Backend API Integration Guide

## Overview

Your Next.js frontend is now configured to connect to your external backend API running on port 5000.

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important:** After creating or updating `.env.local`, restart your Next.js development server:

```bash
npm run dev
```

### 2. Backend CORS Configuration

Your backend API **must** have CORS enabled to accept requests from your Next.js frontend (running on `http://localhost:3000`).

#### Example CORS Configuration for Express.js:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Important: Allows cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

#### Example CORS Configuration for Fastify:

```javascript
import cors from '@fastify/cors';

await fastify.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### 3. API Endpoint Structure

The frontend expects your backend API to have the following endpoint structure:

- **Authentication:**
  - `POST /api/auth/login`
  - `POST /api/auth/register/customer`
  - `POST /api/auth/register/artist`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`

- **Artists:**
  - `GET /api/artists`
  - `GET /api/artists/:id`
  - `GET /api/artists/profile`
  - `PUT /api/artists/profile`
  - `GET /api/artists/bookings`
  - `PUT /api/artists/bookings/:id/accept`
  - `PUT /api/artists/bookings/:id/reject`
  - `GET /api/artists/reviews`

- **Bookings:**
  - `POST /api/bookings`
  - `GET /api/bookings/:id`
  - `PUT /api/bookings/:id`
  - `DELETE /api/bookings/:id`
  - `GET /api/customers/bookings`

- **Categories:**
  - `GET /api/categories`
  - `GET /api/categories/:id`
  - `GET /api/categories/:id/artists`
  - `POST /api/categories`
  - `PUT /api/categories/:id`
  - `DELETE /api/categories/:id`

- **Payments:**
  - `POST /api/payments`
  - `GET /api/payments`
  - `GET /api/customers/payments`
  - `POST /api/payments/:id/refund`

- **Admin:**
  - `GET /api/admin/dashboard/status`
  - `GET /api/admin/users`
  - `GET /api/admin/pending/artists`
  - `GET /api/admin/bookings`
  - `GET /api/admin/payments`

- **Upload:**
  - `POST /api/upload` (multipart/form-data)

## Authentication

The frontend uses JWT tokens stored in cookies. Make sure your backend:

1. **Sets HTTP-only cookies** when users log in:
   ```javascript
   res.cookie('token', jwtToken, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax',
     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
   });
   ```

2. **Reads tokens from cookies** or Authorization headers:
   ```javascript
   const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
   ```

3. **Sends credentials** with requests (handled automatically by axios with `withCredentials: true`)

## Testing the Integration

1. **Start your backend server** on port 5000:
   ```bash
   # In your backend directory
   npm start
   # or
   node server.js
   ```

2. **Start your Next.js frontend**:
   ```bash
   npm run dev
   ```

3. **Test a simple API call:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try logging in or making any API request
   - Verify requests are going to `http://localhost:5000/api/...`
   - Check for CORS errors in the console

4. **Common Issues:**

   - **CORS Error:** Make sure your backend has CORS enabled with `credentials: true`
   - **401 Unauthorized:** Check that your backend is reading tokens from cookies or Authorization headers
   - **Connection Refused:** Ensure your backend is running on port 5000
   - **404 Not Found:** Verify your backend API endpoints match the expected structure above

## Files Modified

The following files were updated to use the external backend:

- ✅ `src/lib/api/axios.ts` - Updated to use `http://localhost:5000` as default
- ✅ `src/lib/api/services/adminService.ts` - Switched from `nextApi` to `axios`
- ✅ `src/lib/api/services/uploadService.ts` - Updated to use axios for uploads
- ✅ All other services already use the axios client

## Switching Back to Next.js API Routes

If you want to switch back to using Next.js API routes instead of the external backend:

1. Set `NEXT_PUBLIC_API_URL=` (empty) in `.env.local`
2. Restart the Next.js server
3. The frontend will use the Next.js API routes in `/src/app/api/`

## Production Deployment

For production, update `.env.local` or your deployment environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

Make sure your production backend:
- Has CORS configured for your frontend domain
- Uses HTTPS
- Has proper security headers configured

