export function getMenuItemImageUrl(item: { images?: Array<{ path: string; isMain: boolean }>, picture?: string }): string {
  if (item.images && item.images.length > 0) {
    const mainImage = item.images.find(img => img.isMain) || item.images[0];
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    return `${backendUrl}/restaurateur/api${mainImage.path.startsWith('/') ? mainImage.path : `/${mainImage.path}`}`;
  }
  if (item.picture) {
    return item.picture;
  }
  return "/GoodFood/logo.png";
}
export function getRestaurantImageUrl(restaurant: { images?: Array<{ path: string; isMain: boolean }>, image?: string }): string {
  if (restaurant.images && restaurant.images.length > 0) {
    const mainImage = restaurant.images.find(img => img.isMain) || restaurant.images[0];
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    return `${backendUrl}/restaurateur/api${mainImage.path.startsWith('/') ? mainImage.path : `/${mainImage.path}`}`;
  }
  if (restaurant.image) {
    return restaurant.image;
  }
  return "/GoodFood/logo.png";
}
