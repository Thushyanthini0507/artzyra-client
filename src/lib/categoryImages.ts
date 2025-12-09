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
 * These match the public IDs used in the seed files
 */
const CATEGORY_PUBLIC_IDS: Record<string, string> = {
  'animator': 'animator.jpg',
  'caterer': 'caterer.jpg',
  'comedian': 'comedian.jpg',
  'dj': 'dj.jpg',
  'dancer': 'dancer.jpg',
  'decorator': 'decorator.jpg',
  'design': 'design.jpg',
  'event planner': 'event_planner.jpg',
  'florist': 'florist.jpg',
  'hair stylist': 'hair_stylist.jpg',
  'magician': 'magician.jpg',
  'makeup artist': 'makeup_artist.jpg',
  'musician': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Michael_Jackson_in_1988.jpg/800px-Michael_Jackson_in_1988.jpg',
  'painter': 'painter.jpg',
  'photographer': 'photographer.jpg',
  'singer': 'singer.jpg',
  'tattoo artist': 'tattoo_artist.jpg',
  'videographer': 'videographer.jpg',
  'voice actor': 'voice_actor.jpg',
  'writer': 'writer.jpg',
};

/**
 * Gets the Cloudinary image URL for a category
 * Uses category's stored image if available, otherwise maps to appropriate Cloudinary images
 */
export function getCategoryImage(category: { name: string; image?: string }): string {
  // If category has a stored image, use it
  if (category.image) {
    // If it's already a Cloudinary URL, optimize it for display (400x300 for cards)
    if (category.image.includes('cloudinary.com')) {
      // Replace w_150,h_150 with w_400,h_300 for better card display
      return category.image.replace(/w_\d+,h_\d+/, 'w_400,h_300');
    }
    // If it's a public ID (like "animator.jpg"), build the URL
    if (!category.image.startsWith('http')) {
      return buildCloudinaryUrl(category.image, { width: 400, height: 300 });
    }
    return category.image;
  }

  // Try to find matching category public ID
  const categoryName = category.name.toLowerCase().trim();
  
  // Direct match first
  if (CATEGORY_PUBLIC_IDS[categoryName]) {
    const imageId = CATEGORY_PUBLIC_IDS[categoryName];
    if (imageId.startsWith('http')) {
      return imageId;
    }
    return buildCloudinaryUrl(imageId, {
      width: 400,
      height: 300,
      crop: 'fill',
    });
  }

  // Partial match
  for (const [key, publicId] of Object.entries(CATEGORY_PUBLIC_IDS)) {
    if (categoryName.includes(key) || key.includes(categoryName)) {
      if (publicId.startsWith('http')) {
        return publicId;
      }
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

