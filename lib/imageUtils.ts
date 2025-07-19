// Utility function to get menu item image URL
export function getMenuItemImageUrl(item: { images?: Array<{ path: string; isMain: boolean }>, picture?: string }): string {
  // Try to get image from new images array first
  if (item.images && item.images.length > 0) {
    const mainImage = item.images.find(img => img.isMain) || item.images[0];
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    return `${backendUrl}/restaurateur/api${mainImage.path.startsWith('/') ? mainImage.path : `/${mainImage.path}`}`;
  }
  
  // Fall back to legacy picture field
  if (item.picture) {
    return item.picture;
  }
  
  // Default fallback image
  return "/GoodFood/logo.png";
}

// Utility function to get restaurant image URL
export function getRestaurantImageUrl(restaurant: { images?: Array<{ path: string; isMain: boolean }>, image?: string }): string {
  // Try to get image from new images array first
  if (restaurant.images && restaurant.images.length > 0) {
    const mainImage = restaurant.images.find(img => img.isMain) || restaurant.images[0];
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    return `${backendUrl}/restaurateur/api${mainImage.path.startsWith('/') ? mainImage.path : `/${mainImage.path}`}`;
  }
  
  // Fall back to legacy image field
  if (restaurant.image) {
    return restaurant.image;
  }
  
  // Default fallback image
  return "/GoodFood/logo.png";
}
