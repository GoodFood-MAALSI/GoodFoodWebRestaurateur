# 🍽️ GoodFood Web Restaurateur

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0.0-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Port-4002-green" alt="Port" />
</div>

<div align="center">
  <h3>🚀 Modern Restaurant Management Platform</h3>
  <p>A comprehensive web application for restaurant owners to manage their establishments, orders, menus, and customer reviews with real-time analytics and intuitive design.</p>
</div>

---

## ✨ Features Overview

### 🏢 **Restaurant Management**
- **Multi-Restaurant Support** - Manage multiple restaurant locations from one dashboard
- **Real-Time Status Control** - Open/close restaurants with instant status updates
- **Interactive Maps** - Geolocation integration with Leaflet for delivery zones
- **Image Management** - Upload and manage restaurant photos with gradient fallbacks
- **Comprehensive Analytics** - Track performance with real-time business metrics

### 📦 **Order Management System**
- **Real-Time Order Tracking** - Live order status updates with color-coded indicators
- **Status Workflow** - Streamlined order progression (Pending → Accepted → Preparing → Ready → Delivered)
- **Advanced Filtering** - Filter orders by status, date, and restaurant
- **Detailed Order Views** - Complete order information with customer details and menu items
- **Pagination Support** - Efficient handling of large order volumes

### 🍕 **Menu & Inventory**
- **Dynamic Menu Creation** - Create and manage menu items with categories
- **Option Management** - Handle menu item variations and extra options
- **Price Management** - Set prices, promotions, and discounts
- **Visual Menu Display** - Rich media support for food photography
- **Real-Time Updates** - Instant menu changes across all platforms

### ⭐ **Review & Rating System**
- **Customer Review Management** - View and respond to customer feedback
- **Rating Analytics** - Detailed rating breakdowns and trends
- **Pagination & Filtering** - Filter reviews by rating (1-5 stars)
- **Real-Time Stats** - Average ratings and review count tracking

### 📊 **Business Intelligence**
- **Revenue Analytics** - Track daily, weekly, monthly, and yearly revenue
- **Popular Item Insights** - Identify best-selling menu items
- **Order Statistics** - Comprehensive order count and trend analysis
- **Performance Metrics** - Average order value, customer satisfaction rates
- **Growth Tracking** - Revenue growth percentage calculations

### 🔐 **Authentication & Security**
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access** - Restaurant owner permissions and access control
- **Session Management** - Persistent login with secure cookie handling
- **API Security** - Bearer token protection for all API endpoints

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15.2.4 with App Router
- **UI Library**: React 19.0.0 with TypeScript 5.0
- **Styling**: Tailwind CSS 4.0 with custom design system
- **Components**: Radix UI + shadcn/ui component library
- **Icons**: Lucide React for consistent iconography
- **Maps**: React Leaflet for interactive mapping
- **Charts**: Recharts for data visualization
- **Notifications**: Sonner for toast notifications

### **Backend Integration**
- **API Architecture**: RESTful API with proxy routes
- **Authentication**: JWT Bearer token authentication
- **Data Fetching**: Custom React hooks with error handling
- **State Management**: React hooks with optimistic updates
- **File Uploads**: Multipart form data handling

### **Development Tools**
- **Language**: TypeScript with strict type checking
- **Linting**: ESLint with Next.js configuration
- **Styling**: PostCSS with Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Turbopack for fast development builds

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API server running on port 8080
- Environment variables configured

### Installation

```bash
# Clone the repository
git clone https://github.com/GoodFood-MAALSI/GoodFoodWebRestaurateur.git
cd GoodFoodWebRestaurateur

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Configuration

```env
# Backend API Configuration
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Application Configuration
NODE_ENV=development
```

### Development Scripts

```bash
# Development server (runs on http://localhost:4002)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📱 Application Structure

### **Page Architecture**

```
app/
├── 🏠 / (page.tsx)                    # Landing/Dashboard
├── 👤 profile/ (page.tsx)             # User Profile & Quick Actions
├── 🏢 restaurants/                    # Restaurant Management
│   ├── page.tsx                       # Restaurant List (Paginated)
│   └── [id]/                         # Individual Restaurant
│       ├── page.tsx                   # Restaurant Details & Analytics
│       └── orders/page.tsx            # Restaurant-Specific Orders
├── 📦 orders/page.tsx                 # Global Orders Management
├── ⭐ ratings/page.tsx                # Review & Rating Management
├── 📊 stats/page.tsx                  # Business Analytics Dashboard
├── 🔐 auth/page.tsx                   # Authentication
├── ➕ create-company/page.tsx         # Restaurant Creation
└── 🔄 api/proxy/                      # API Proxy Routes
```

### **Key Components**

#### **Restaurant Cards**
```tsx
// Responsive restaurant cards with status indicators
<RestaurantCard 
  name={restaurant.name}
  description={restaurant.description}
  image={restaurant.image}
  isOpen={restaurant.is_open}
  averageRating={restaurant.average_rating}
  reviewCount={restaurant.review_count}
/>
```

#### **Order Management**
```tsx
// Comprehensive order list with status controls
<OrdersList
  orders={orders}
  loading={loading}
  error={error}
  onRefresh={refetch}
  onStatusChange={handleStatusChange}
  showRestaurantFilter={true}
/>
```

#### **Pagination System**
```tsx
// Consistent pagination across all data-heavy pages
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
/>
```

---

## 🎨 Design System

### **Color Palette**
```scss
// Primary Colors
--primary: #76C893      // Fresh Green
--secondary: #168AAD    // Ocean Blue
--accent: #FFB30F       // Golden Yellow

// Status Colors
--success: #10B981      // Green
--warning: #F59E0B      // Amber  
--error: #EF4444        // Red
--info: #3B82F6         // Blue

// Order Status Colors
--pending: #F59E0B      // Amber
--accepted: #10B981     // Green
--preparing: #3B82F6    // Blue
--ready: #8B5CF6        // Purple
--delivered: #059669    // Emerald
--cancelled: #EF4444    // Red
```

### **Typography**
- **Headings**: Inter font family with font weights 400-700
- **Body Text**: Optimized for readability with proper line heights
- **Responsive Design**: Mobile-first approach with breakpoints

### **Component Design**
- **Consistent Spacing**: 4px, 8px, 16px, 24px, 32px grid system
- **Rounded Corners**: 8px, 12px, 16px for different component sizes
- **Shadows**: Subtle elevation with multiple shadow layers
- **Hover Effects**: Smooth transitions with scale and shadow changes

---

## 🔌 API Integration

### **Proxy Architecture**
All API calls go through Next.js API routes for security and consistency:

```typescript
// Example API proxy route
export async function GET(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const response = await fetch(`${BACKEND}/restaurateur/api/restaurants`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return NextResponse.json(await response.json());
}
```

### **Key API Endpoints**

| Endpoint | Purpose | Features |
|----------|---------|----------|
| `/api/proxy/restaurants` | Restaurant CRUD | Pagination, filtering |
| `/api/proxy/orders/{id}` | Order management | Status updates, details |
| `/api/proxy/orders/{id}/stats` | Analytics | Revenue, popular items |
| `/api/proxy/client-review-restaurant/{id}` | Reviews | Rating filters, pagination |
| `/api/proxy/restaurant/me` | User restaurants | Paginated list |

### **Custom Hooks**

```typescript
// Restaurant management
const { restaurants, loading, pagination } = useRestaurants({ page, limit });

// Order tracking
const { orders, stats, updateOrderStatus } = useRestaurantOrdersAndStats(restaurantId);

// Review management
const { reviews, pagination, stats } = useReviews(restaurantId, { page, limit, rating });

// Analytics
const { stats, loading } = useRestaurantStats(restaurantId);
```

---

## 📊 Features Deep Dive

### **Dashboard Analytics**
- **Revenue Tracking**: Real-time revenue calculations with growth percentages
- **Order Insights**: Status distribution with color-coded metrics
- **Popular Items**: Best-selling menu items with order counts
- **Performance Metrics**: Average order value and customer satisfaction

### **Order Management**
- **Status Workflow**: 6-stage order progression with instant updates
- **Bulk Operations**: Filter and manage multiple orders efficiently
- **Detailed Views**: Complete order information including customer details
- **Real-Time Updates**: Live status changes with optimistic UI updates

### **Restaurant Management**
- **Multi-Location Support**: Manage multiple restaurants from one interface
- **Status Control**: Instant open/close toggles with visual feedback
- **Image Management**: Upload and manage restaurant photos
- **Location Services**: Interactive maps with delivery radius visualization

### **Review System**
- **Rating Analytics**: Detailed breakdown of 1-5 star ratings
- **Filter Options**: Filter reviews by rating level
- **Response Management**: View and manage customer feedback
- **Trend Analysis**: Track rating changes over time

---

## 🔒 Security Features

### **Authentication**
- **JWT Tokens**: Secure authentication with HTTP-only cookies
- **Session Management**: Automatic token refresh and logout
- **Route Protection**: Server-side authentication checks
- **CSRF Protection**: Built-in Next.js security features

### **Data Protection**
- **Input Validation**: Zod schema validation for all forms
- **XSS Prevention**: Automatic escaping of user-generated content
- **API Security**: Bearer token validation on all endpoints
- **Environment Variables**: Secure configuration management

---

## 📱 Mobile Responsiveness

### **Responsive Design**
- **Mobile-First Approach**: Optimized for mobile devices
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive designs
- **Touch-Friendly**: Large touch targets and gesture support
- **Performance**: Optimized images and lazy loading

### **Breakpoints**
```scss
// Mobile First Breakpoints
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Small desktops
xl: 1280px  // Large desktops
2xl: 1536px // Extra large screens
```

---

## 🚀 Performance Optimizations

### **Next.js Features**
- **App Router**: Latest Next.js routing with improved performance
- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Automatic image compression and lazy loading
- **Code Splitting**: Automatic route-based code splitting

### **Optimization Techniques**
- **Pagination**: Efficient data loading for large datasets
- **Debounced Search**: Optimized search with request throttling
- **Optimistic Updates**: Instant UI feedback before server confirmation
- **Error Boundaries**: Graceful error handling and recovery

---

## 🧪 Development Workflow

### **Code Quality**
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Code formatting (if using Prettier)
npx prettier --write .
```

### **Development Best Practices**
- **TypeScript**: Strict type checking for all components
- **Component Composition**: Reusable and maintainable components
- **Custom Hooks**: Centralized business logic and state management
- **Error Handling**: Comprehensive error boundaries and fallbacks

---

## 📦 Deployment

### **Production Build**
```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### **Environment Setup**
- **Environment Variables**: Configure for production environment
- **Database**: Ensure database connections are properly configured
- **API Endpoints**: Update backend API URLs for production
- **Security**: Enable HTTPS and configure security headers

---

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Use consistent naming conventions
- Write descriptive commit messages
- Add proper error handling
- Include type definitions for all functions

---

## 📝 License

This project is part of the GoodFood ecosystem and is proprietary software developed for restaurant management purposes.

---

## 🆘 Support

### **Getting Help**
- **Documentation**: Check this README and inline code comments
- **Issues**: Open GitHub issues for bugs and feature requests
- **Development**: Contact the development team for technical support

### **Common Issues**
- **Port Conflicts**: Default port is 4002, change in package.json if needed
- **API Connection**: Ensure backend server is running on port 8080
- **Authentication**: Check JWT token configuration and cookie settings

---

<div align="center">
  <h3>🍽️ Built with ❤️ for Restaurant Success</h3>
  <p>Empowering restaurant owners with modern technology</p>
</div>