/**
 * Category Image Utility
 * Generates Cloudinary URLs for category images
 */

// Cloudinary cloud name - update this with your actual cloud name
// Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env.local file
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

/**
 * Builds a Cloudinary image URL with transformations
 */
export function buildCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}
): string {
  const {
    width = 400,
    height = 300,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options;

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}

/**
 * Map category names to Cloudinary public IDs
 * Update these public IDs with your actual Cloudinary image public IDs
 */
const CATEGORY_PUBLIC_IDS: Record<string, string> = {
  'animator': 'categories/animator',
  'caterer': 'categories/caterer',
  'comedian': 'categories/comedian',
  'dj': 'categories/dj',
  'dancer': 'categories/dancer',
  'decorator': 'categories/decorator',
  'design': 'categories/design',
  'event planner': 'categories/event-planner',
  'florist': 'categories/florist',
  'hair stylist': 'categories/hair-stylist',
  'magician': 'categories/magician',
  'makeup artist': 'categories/makeup-artist',
  'musician': 'categories/musician',
  'painter': 'categories/painter',
  'photographer': 'categories/photographer',
  'singer': 'categories/singer',
  'tattoo artist': 'categories/tattoo-artist',
  'videographer': 'categories/videographer',
  'voice actor': 'categories/voice-actor',
  'writer': 'categories/writer',
};

/**
 * Gets the Cloudinary image URL for a category
 * Uses category's stored image if available, otherwise maps to appropriate Cloudinary images
 */
export function getCategoryImage(category: { name: string; image?: string }): string {
  // If category has a stored image, use it
  if (category.image) {
    // If it's already a Cloudinary URL, optimize it
    if (category.image.includes('cloudinary.com')) {
      return optimizeCloudinaryUrl(category.image, { width: 400, height: 300 });
    }
    // If it's a public ID, build the URL
    if (!category.image.startsWith('http')) {
      return buildCloudinaryUrl(category.image, { width: 400, height: 300 });
    }
    return category.image;
  }

  // Try to find matching category public ID
  const categoryName = category.name.toLowerCase().trim();
  
  // Direct match first
  if (CATEGORY_PUBLIC_IDS[categoryName]) {
    return buildCloudinaryUrl(CATEGORY_PUBLIC_IDS[categoryName], {
      width: 400,
      height: 300,
      crop: 'fill',
    });
  }

  // Partial match
  for (const [key, publicId] of Object.entries(CATEGORY_PUBLIC_IDS)) {
    if (categoryName.includes(key) || key.includes(categoryName)) {
      return buildCloudinaryUrl(publicId, {
        width: 400,
        height: 300,
        crop: 'fill',
      });
    }
  }

  // Default Cloudinary sample image
  return buildCloudinaryUrl('sample', {
    width: 400,
    height: 300,
    crop: 'fill',
  });
}

/**
 * Optimizes an existing Cloudinary URL with transformations
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
  } = {}
): string {
  const { width = 400, height = 300, quality = 'auto' } = options;

  // If URL already has transformations, replace or add them
  if (url.includes('/upload/')) {
    const uploadIndex = url.indexOf('/upload/');
    const beforeUpload = url.substring(0, uploadIndex + 8);
    const afterUpload = url.substring(uploadIndex + 8);

    // Check if transformations already exist
    if (afterUpload.includes('/')) {
      // Replace existing transformations
      const publicId = afterUpload.substring(afterUpload.indexOf('/') + 1);
      return buildCloudinaryUrl(publicId, { width, height, quality });
    } else {
      // Add transformations
      return buildCloudinaryUrl(afterUpload, { width, height, quality });
    }
  }

  return url;
}

