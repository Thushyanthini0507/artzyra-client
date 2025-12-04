# Cloudinary Image Upload Setup Guide

This guide explains how to set up Cloudinary for image uploads in the May Gallery page.

## Prerequisites

1. A Cloudinary account (sign up at https://cloudinary.com)
2. Access to your Cloudinary dashboard

## Setup Steps

### 1. Get Your Cloudinary Credentials

1. Log in to your Cloudinary dashboard: https://cloudinary.com/console
2. Go to **Settings** → **Security** (or Dashboard)
3. Copy the following values:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 2. Create an Upload Preset (Recommended)

1. In Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `artzyra-upload` (or any name you prefer)
   - **Signing mode**: Select **Unsigned** (for easier client uploads)
   - **Folder**: `artzyra/may` (optional, but recommended for organization)
   - **Allowed formats**: Select image formats (jpg, png, gif, webp)
   - **Max file size**: 10MB (or your preferred limit)
5. Click **Save**

### 3. Configure Environment Variables

1. Copy `.env.local` from `env.example` (if not already done):
   ```bash
   cp env.example .env.local
   ```

2. Open `.env.local` and add your Cloudinary credentials:

   ```env
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
   CLOUDINARY_UPLOAD_PRESET=artzyra-upload
   ```

   **Important**: Replace the placeholder values with your actual Cloudinary credentials.

### 4. Restart Your Development Server

After updating `.env.local`, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

### Upload Flow

1. **User selects image** → Frontend validates file type and size
2. **User clicks "Upload"** → Image sent to `/api/upload`
3. **Backend validates** → Checks authentication and file
4. **Cloudinary upload** → Image uploaded to Cloudinary
5. **MongoDB storage** → Image metadata saved to database
6. **Gallery update** → New image appears in gallery

### Image Storage

- **Cloudinary**: Stores the actual image files
- **MongoDB**: Stores image metadata (URL, user, timestamp, etc.)

### Image Optimization

Images are automatically optimized when displayed:
- **Width**: Limited to 300px for gallery display
- **Format**: Cloudinary automatically serves optimized formats (WebP when supported)
- **Quality**: Auto-optimized for web

## Troubleshooting

### "Image upload service not configured"

- Check that all Cloudinary environment variables are set in `.env.local`
- Restart your development server after adding environment variables

### "Unauthorized - Please log in to upload images"

- User must be logged in to upload images
- Check that authentication cookies are being sent

### "File size must be less than 10MB"

- The current limit is 10MB
- To change, update `MAX_FILE_SIZE` in `/src/app/api/upload/route.ts`

### "Failed to upload image to Cloudinary"

- Verify your Cloudinary credentials are correct
- Check that your upload preset exists and is set to "Unsigned"
- Check Cloudinary dashboard for any account limits or issues

### Images not displaying

- Check browser console for errors
- Verify Cloudinary URLs are accessible
- Check that images were successfully uploaded to Cloudinary

## Security Notes

1. **Never commit `.env.local`** to version control
2. **Use unsigned upload presets** for client uploads (simpler and secure)
3. **Validate file types** on both client and server
4. **Set file size limits** to prevent abuse
5. **Require authentication** for uploads (already implemented)

## API Endpoints

### POST `/api/upload`

Uploads an image to Cloudinary and saves metadata to MongoDB.

**Authentication**: Required (logged-in users only)

**Request**:
- Method: `POST`
- Body: `FormData` with `image` field
- Headers: Includes authentication cookie

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "cloudinaryUrl": "https://res.cloudinary.com/...",
    "user": { "name": "...", "email": "..." },
    "createdAt": "..."
  },
  "message": "Image uploaded successfully"
}
```

### GET `/api/images`

Fetches all uploaded images (public endpoint).

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "cloudinaryUrl": "https://...",
      "user": { "name": "...", "email": "..." },
      "createdAt": "..."
    }
  ]
}
```

## Next Steps

- Customize image transformations in Cloudinary
- Add image deletion functionality
- Implement image categories/tags
- Add user-specific image galleries
- Implement image search/filtering

