# Backend Connection Fix

## Problem
The frontend was trying to connect to an external backend at `http://localhost:5000` but the application uses Next.js API routes (which run on the same server as the frontend).

## Solution
All API services have been updated to use `nextApi` instead of the axios client, which connects to Next.js API routes instead of an external backend.

## Changes Made

### 1. Updated All API Services
All services in `src/lib/api/services/` now use `nextApi`:
- ✅ `authService.ts` - Already updated
- ✅ `categoryService.ts` - Updated
- ✅ `artistService.ts` - Updated
- ✅ `bookingService.ts` - Updated
- ✅ `customerService.ts` - Updated
- ✅ `paymentService.ts` - Updated
- ✅ `reviewService.ts` - Updated
- ✅ `notificationService.ts` - Updated

### 2. Environment Variable Update Required

**IMPORTANT:** Update your `.env.local` file:

```bash
# Change this:
NEXT_PUBLIC_API_URL=http://localhost:5000

# To this (empty string to use Next.js API routes):
NEXT_PUBLIC_API_URL=
```

Or simply remove the line entirely if you're using Next.js API routes.

## How It Works Now

1. **Frontend** → Makes request to `/api/*` (Next.js API routes)
2. **Next.js API Routes** → Handle the request, connect to MongoDB, return response
3. **No external backend needed** - Everything runs on the Next.js server

## Testing

After updating `.env.local`:

1. **Restart your development server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Test login:**
   - Go to `/auth/login`
   - Login with admin credentials: `admin@artzyra.com` / `admin123`
   - Should redirect to `/admin` dashboard

3. **Check browser console:**
   - Look for `[nextApi] Making request to: /api/...` logs
   - Should see successful responses

4. **Check network tab:**
   - Requests should go to `http://localhost:3000/api/*` (not `localhost:5000`)
   - Status should be 200/201 for successful requests

## Troubleshooting

### Still seeing connection errors?
1. Make sure `.env.local` has `NEXT_PUBLIC_API_URL=` (empty)
2. Restart the dev server after changing `.env.local`
3. Clear browser cache and cookies
4. Check that Next.js API routes exist in `src/app/api/`

### API routes not found (404)?
- Make sure you have API route files in `src/app/api/`
- Example: `src/app/api/auth/login/route.ts` for `/api/auth/login`

### CORS errors?
- Should not occur with Next.js API routes (same origin)
- If you see CORS errors, check that requests are going to the correct URL

## Next Steps

If you need to use an external Express backend in the future:

1. Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in `.env.local`
2. Update `next.config.ts` to enable rewrites (see commented code)
3. Or update services to use the `ApiClient` class instead of `nextApi`




