# Setup Guide: Connecting Frontend to Backend

## Architecture Overview

You have two options for connecting your frontend to the backend:

### Option 1: Next.js API Routes (Current Setup) ✅ Recommended
- Frontend (localhost:3000) → Next.js API Routes → MongoDB
- All API routes are in `/src/app/api/`
- No separate Express server needed

### Option 2: External Express Backend
- Frontend (localhost:3000) → Express Backend (localhost:5000) → MongoDB
- Requires separate Express server running

---

## Setup Instructions

### Step 1: Create Environment File

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

### Step 2: Configure Environment Variables

Open `.env.local` and add your configuration:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://thushyanthini0507_db_user:thusi0507@artzyra.zd9ep8g.mongodb.net/artzyra_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters-long
JWT_EXPIRES_IN=7d

# API Configuration
# For Option 1 (Next.js API Routes): Leave empty or remove
NEXT_PUBLIC_API_URL=

# For Option 2 (External Backend): Set to your backend URL
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

### Step 3: Choose Your Architecture

#### Option 1: Using Next.js API Routes (Recommended)

**Advantages:**
- ✅ No separate server to manage
- ✅ Better performance (no network hop)
- ✅ Simpler deployment
- ✅ Already configured in your codebase

**Configuration:**
1. Set `NEXT_PUBLIC_API_URL=` (empty) in `.env.local`
2. Make sure MongoDB connection is configured
3. Start the Next.js dev server: `npm run dev`

**How it works:**
- Frontend calls `/api/auth/login` → Next.js API route → MongoDB
- All routes are in `/src/app/api/`

#### Option 2: Using External Express Backend

**Advantages:**
- ✅ Separation of concerns
- ✅ Can scale backend independently
- ✅ Good for microservices architecture

**Configuration:**
1. Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in `.env.local`
2. Make sure your Express backend is running on port 5000
3. Update `next.config.ts` to enable rewrites (see below)
4. Start both servers:
   - Backend: `npm run dev` (in backend directory)
   - Frontend: `npm run dev` (in frontend directory)

**Update `next.config.ts`:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
```

---

## Current Setup (Option 1)

Your codebase is currently configured for **Option 1** (Next.js API Routes). 

### Files that connect to MongoDB:
- `/src/lib/db.ts` - Database connection
- `/src/app/api/auth/login/route.ts` - Login endpoint
- `/src/app/api/admin/users/route.ts` - Admin endpoints
- All other routes in `/src/app/api/`

### To use this setup:

1. **Create `.env.local` file:**
```bash
cp env.example .env.local
```

2. **Add MongoDB connection:**
```env
MONGO_URI=mongodb+srv://thushyanthini0507_db_user:thusi0507@artzyra.zd9ep8g.mongodb.net/artzyra_db?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters-long
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=
NODE_ENV=development
```

3. **Install dependencies (if not done):**
```bash
npm install
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Access your app:**
- Frontend: http://localhost:3000
- API Routes: http://localhost:3000/api/*

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
- Check your `MONGO_URI` is correct
- Make sure MongoDB Atlas allows connections from your IP
- Check network connectivity

### Issue: "JWT_SECRET is not defined"
- Make sure `.env.local` exists in the root directory
- Restart your dev server after adding environment variables
- Check that variable names match exactly (case-sensitive)

### Issue: "API calls failing"
- Check browser console for errors
- Verify the API route exists in `/src/app/api/`
- Check network tab in DevTools

### Issue: "CORS errors"
- If using Option 2, make sure your Express backend has CORS enabled
- If using Option 1, CORS is handled automatically by Next.js

---

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | No | `7d` |
| `NEXT_PUBLIC_API_URL` | External backend URL | No | `http://localhost:5000` |
| `NODE_ENV` | Environment mode | No | `development` |

---

## Next Steps

1. ✅ Create `.env.local` file
2. ✅ Add your MongoDB connection string
3. ✅ Add JWT secret
4. ✅ Start the dev server
5. ✅ Test login functionality
6. ✅ Test admin features

---

## Need Help?

- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Make sure MongoDB Atlas is accessible
- Ensure you're logged in as admin to test admin features



