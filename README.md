# Karigo - Service Marketplace Platform

A modern service marketplace platform (similar to Urban Company/Fiverr) built with **React + Vite** and **Node.js + Express**. Connect customers with verified service professionals for fast, reliable, and hassle-free service delivery.

## 🎯 Overview

Karigo is a full-stack web application that bridges customers and service providers. Users can browse services, find professionals, book appointments, and leave reviews - all within an intuitive interface with a modern dark theme.

**Tech Stack:**

- **Frontend:** React 19.2.5 + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **API Client:** Axios

## ✨ Key Features

### 🔐 Authentication & Authorization

- User registration with email/password
- Role-based access control (Customer, Service Provider, Admin)
- Secure JWT authentication
- Auto-login after registration
- Protected routes with role verification

### 🔍 Browse & Discovery

- **Services Listing** - Browse all available services with descriptions
- **Worker Profiles** - Search and filter workers by service category
- **Advanced Filters** - Sort by rating, price, experience, or response time
- **Search Functionality** - Find workers by name or service type
- **Service Categories** - Quick access to plumbing, electrical, painting, cleaning, etc.

### 💼 Worker Profiles

- Comprehensive profile information (experience, ratings, jobs done)
- **About Tab** - Professional description and skills
- **Reviews Tab** - Customer feedback with ratings
- **Response Time** - Average response duration
- **Availability Status** - Real-time availability indicator
- Contact information and location

### 📅 Booking System

- **Instant Booking** - Schedule service with date, time, and location
- **Booking Status Tracking** - Monitor progress (Pending → Accepted → Completed)
- **Booking History** - View all past and current bookings
- **Status Badges** - Color-coded status indicators (Green=Completed, Blue=Accepted, Yellow=Pending, Red=Rejected)
- **Price Display** - Transparent pricing before booking

### ❤️ Favorites System

- Add/remove favorite workers
- Heart icon on worker cards for quick favoriting
- Persistent favorites across sessions
- Quick access to favorite workers

### ⭐ Reviews & Ratings

- Leave detailed reviews after service completion
- 5-star rating system
- Automatic worker rating calculation
- Display reviews on worker profiles with dates and user names
- Sort workers by rating

### 👤 User Profiles

- View and edit personal information
- Display account type (Customer/Service Provider)
- Membership date tracking
- Avatar with user initials
- Phone number and email management

## 📁 Project Structure

```
WEB/mini-project/
├── back-end/
│   ├── routes/
│   │   ├── authRoutes.js          # Login/Register endpoints
│   │   ├── bookingRoutes.js        # Booking management
│   │   ├── serviceRoutes.js        # Service listings
│   │   ├── workerRoutes.js         # Worker profiles
│   │   ├── reviewRoutes.js         # Reviews & ratings
│   │   └── favoriteRoutes.js       # Favorites management
│   ├── controllers/
│   │   ├── authController.js       # Auth logic
│   │   ├── bookingController.js    # Booking logic
│   │   ├── workerController.js     # Worker logic
│   │   ├── reviewController.js     # Review logic
│   │   └── favoriteController.js   # Favorites logic
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification
│   ├── utils/
│   │   └── generateToken.js        # JWT token generation
│   ├── app.js                      # Express app setup
│   ├── server.js                   # Server entry point
│   ├── package.json                # Dependencies
│   └── database_schema.sql         # PostgreSQL schema
│
├── front-end/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Dashboard with featured services
│   │   │   ├── Login.jsx           # Authentication page
│   │   │   ├── Register.jsx        # Sign up page
│   │   │   ├── Services.jsx        # Services listing
│   │   │   ├── FindWorkers.jsx     # Worker discovery & filtering
│   │   │   ├── WorkerProfile.jsx   # Detailed worker info
│   │   │   ├── Profile.jsx         # User profile management
│   │   │   ├── Orders.jsx          # Booking history
│   │   │   ├── WorkerDashboard.jsx # Worker panel
│   │   │   └── AdminDashboard.jsx  # Admin panel
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── Footer.jsx          # Footer
│   │   │   ├── WorkerCard.jsx      # Worker card component
│   │   │   ├── ServiceCard.jsx     # Service card component
│   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   ├── api/
│   │   │   └── axios.js            # API client configuration
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # React entry point
│   ├── package.json                # Dependencies
│   └── vite.config.js              # Vite configuration
│
└── SETUP_GUIDE.md                  # Installation instructions
```

## 🎨 Design System

**Color Palette:**

- **Primary Background:** `#28364D` - Deep blue-gray
- **Secondary Background:** `#384B6B` - Lighter blue-gray
- **Card Background:** `#486089` - Medium blue
- **Accent Color:** `#7A3FE0` - Purple
- **Border Color:** `#5875A7` - Steel blue
- **Text Color:** `#EEF1F6` - Light gray-white
- **Secondary Text:** `#B2C0D7` - Muted gray-blue

**Typography:**

- Headers: Semibold/Bold with tracking
- Cards: Rounded corners (lg, xl)
- Buttons: Gradient (Purple → Steel Blue)
- Hover Effects: Shadow elevation + transitions

## 🚀 Getting Started

### Quick Start

```bash
# Backend
cd back-end
npm install
npm run dev

# Frontend (in new terminal)
cd front-end
npm install
npm run dev
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Services

- `GET /api/services` - List all services

### Workers

- `GET /api/workers` - List workers
- `GET /api/workers/:id` - Get worker details
- `POST /api/workers` - Create worker profile
- `PUT /api/workers/:id` - Update worker profile

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/:userId` - User's bookings
- `PATCH /api/bookings/:id/status` - Update booking status

### Reviews

- `POST /api/reviews` - Create review
- `GET /api/reviews/worker/:workerId` - Get worker reviews
- `DELETE /api/reviews/:id` - Delete review

### Favorites

- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Remove from favorites
- `GET /api/favorites/check/:userId/:workerId` - Check if favorited

## 🔐 Authentication Flow

1. **Register** → Create account with email, password, and role selection
2. **Store Token** → JWT token saved to localStorage
3. **API Requests** → Include token in Authorization header
4. **Auto-Login** → Check localStorage for existing session
5. **Protected Routes** → Redirect to login if unauthorized

## 🎯 User Workflows

### Customer Workflow

1. Register/Login as Customer
2. Browse services on Home page
3. Click on service → Find Workers page with filters
4. Select worker → View detailed profile
5. Click "Book Now" → Fill booking details
6. Confirm booking → View in Orders/My Bookings
7. Leave review after completion

### Service Provider Workflow

1. Register/Login as Service Provider
2. Complete worker profile
3. Manage bookings in Worker Dashboard
4. Accept/reject incoming bookings
5. Mark services as complete
6. Build reputation through reviews

## 📊 Database Schema

**Tables:**

- `users` - User accounts with roles
- `services` - Available service categories
- `workers` - Service provider profiles
- `bookings` - Service appointments
- `reviews` - Customer feedback
- `favorites` - User favorite workers

## 🎭 Demo Account

**Test Credentials:**

- Email: `demo@example.com`
- Password: `Demo@123`

## ✅ Completed Features

- ✅ Full authentication system (register, login, JWT)
- ✅ Service browsing and filtering
- ✅ Worker discovery with search and filters
- ✅ Detailed worker profiles with reviews
- ✅ Booking system with date/time selection
- ✅ Booking history and status tracking
- ✅ Favorites/wishlist functionality
- ✅ Review and rating system
- ✅ User profile management
- ✅ Role-based access control
- ✅ Responsive dark theme UI
- ✅ Professional styling with Tailwind CSS
- ✅ Error handling and validation
- ✅ Loading states and feedback

## 🚧 Future Enhancements

- [ ] Admin Dashboard - Manage users, workers, and disputes
- [ ] Worker Dashboard - Accept/reject bookings, track earnings
- [ ] Payment Integration - Stripe or Razorpay
- [ ] Image Upload - Cloudinary for profiles and portfolios
- [ ] Real-time Notifications - Email/SMS updates
- [ ] Chat System - Direct messaging between users and workers
- [ ] Analytics - Performance metrics and insights
- [ ] Mobile App - React Native version
- [ ] Testing Suite - Unit and integration tests
- [ ] CI/CD Pipeline - Automated deployment

## 🛠️ Technology Highlights

**Frontend Optimization:**

- Vite for fast build and HMR
- Tailwind CSS for responsive design
- React Router v7 for client-side navigation
- Axios with interceptors for API calls
- LocalStorage for persistent sessions

**Backend Best Practices:**

- Express.js middleware for authentication
- PostgreSQL for data integrity
- JWT for stateless authentication
- Bcrypt for password hashing
- CORS enabled for cross-origin requests

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly buttons and spacing
- Tested on various viewport sizes

## 🐛 Troubleshooting

**Database Connection Error?**

- Ensure PostgreSQL is running
- Check .env credentials
- Run `database_schema.sql`

**API Not Responding?**

- Verify backend server is running
- Check CORS configuration
- Confirm port 5000 is available

**Login Fails?**

- Clear browser localStorage
- Check user exists in database
- Verify password is correct

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more help.

## 📄 License

This project is open source and available under the ISC License.

## 👨‍💻 Development

**Prerequisites:**

- Node.js v14+
- PostgreSQL v12+
- Git

**Getting Involved:**

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Made with ❤️ by the Karigo Team**
