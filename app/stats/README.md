# Stats Page - GoodFood Web Restaurateur

## Overview

The stats page provides comprehensive analytics and insights for restaurant owners to track their business performance. It displays key metrics including order counts, revenue, popular menu items, and more.

## Features

### 📊 Key Statistics
- **Order Count**: Total number of orders received
- **Revenue**: Total revenue generated
- **Items Sold**: Total number of menu items sold
- **Average Order Value**: Revenue per order

### 🏆 Popular Menu Item
- Displays the most frequently ordered menu item
- Shows item details including price and promotions
- Highlights the number of times the item was ordered

### 🏪 Restaurant Selection
- Dropdown selector to choose between different restaurants
- Shows restaurant status (open/closed)
- Displays restaurant descriptions

## API Integration

### Endpoint
```
GET /api/proxy/orders/{restaurantId}/stats
```

### Response Format
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "order_count": 2,
    "menu_item_id": 1,
    "menu_item": {
      "id": 1,
      "name": "Menu Salade Ch'ti",
      "price": "12.00",
      "promotion": "0.00"
    },
    "item_count": 2,
    "revenue": 61
  }
}
```

## Components

### 1. StatsCard
A reusable component for displaying statistical information with:
- Icon representation
- Title and subtitle
- Trend indicators (optional)
- Hover animations

### 2. PopularMenuItem
Specialized component showing:
- Menu item name and price
- Promotion details (if applicable)
- Order count for the item
- Visual hierarchy with crown icon

### 3. RestaurantSelector
Dropdown component featuring:
- Restaurant list with descriptions
- Open/closed status indicators
- Smooth animations and hover states

### 4. StatsPage (Main Component)
The main page component that:
- Manages state for selected restaurant
- Handles data fetching and error states
- Provides loading skeletons
- Displays insights and analytics

## Hooks

### useRestaurantStats
Custom hook for fetching restaurant statistics:
- Automatic refetching when restaurant changes
- Error handling and loading states
- Manual refresh capability

## Styling

The stats page follows the GoodFood design system:
- **Primary Color**: `#76C893` (Green)
- **Secondary Color**: `#168AAD` (Blue)
- **Consistent spacing**: Uses Tailwind CSS classes
- **Responsive design**: Mobile-first approach
- **Smooth animations**: Hover effects and transitions

## Navigation

The stats page is accessible via:
- Header navigation bar
- Direct URL: `/stats`
- Icon: BarChart3 (Lucide React)

## Error Handling

The page handles various error states:
- Network connection issues
- API endpoint errors
- No data available scenarios
- Restaurant selection validation

## Performance Features

- **Loading Skeletons**: Prevents layout shift during data loading
- **Optimistic Updates**: Immediate UI feedback
- **Efficient Re-renders**: Only updates when necessary
- **Background Refresh**: Manual refresh without page reload

## Future Enhancements

Potential improvements could include:
- Date range filtering
- Comparison between restaurants
- Chart visualizations
- Export functionality
- Real-time updates
- Performance trends over time
