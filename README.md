# Findyy - The "Anti-Gravity" Roommate Finder

A production-ready, ultra-modern full-stack web application for finding roommates near ADYPU Campus, Pune, India. Built with React, Node.js, Express, MongoDB, and featuring real-time messaging, payments, reviews, and more.

## 🚀 Features

### Core Features
- ✅ **Smart Search** - Filter by Pure Veg, Gender, Price, Distance, Lifestyle
- ✅ **Map Integration** - Google Maps with location-based search
- ✅ **Roommate Matching** - "Vibe Check" (Early Bird vs Night Owl)
- ✅ **User Authentication** - JWT-based auth with protected routes
- ✅ **Real-time Messaging** - WebSocket-powered chat system
- ✅ **Reviews & Ratings** - User reviews with star ratings
- ✅ **Favorites/Wishlist** - Save favorite listings
- ✅ **Image Uploads** - Cloudinary integration for listing photos
- ✅ **Payment Integration** - Stripe payment processing
- ✅ **Email Notifications** - Automated email service

### UI/UX Features
- 🎨 **Brutalist Design** - High-contrast black/white aesthetic
- ✨ **Smooth Animations** - Framer Motion + GSAP ScrollTrigger
- 🖱️ **Custom Cursor** - Animated trailing cursor
- 📜 **Smooth Scrolling** - Lenis smooth scroll library
- 🎯 **Magnetic Buttons** - Interactive hover effects

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Animation library
- **GSAP + ScrollTrigger** - Advanced scroll animations
- **Lenis** - Smooth scrolling
- **React Animated Cursor** - Custom cursor
- **Socket.io Client** - Real-time messaging
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** + **Express** - RESTful API
- **MongoDB** + **Mongoose** - Database with GeoJSON
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** + **Cloudinary** - Image uploads
- **Stripe** - Payment processing
- **Nodemailer** - Email service

## 📁 Project Structure

```
findyy/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context (Auth)
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   └── App.jsx          # Main app component
│   └── package.json
├── backend/
│   ├── models/              # Mongoose models
│   ├── controllers/         # Route controllers
│   ├── routes/              # Express routes
│   ├── middleware/          # Custom middleware
│   ├── services/            # Business logic
│   ├── socket/              # Socket.io handlers
│   ├── data/                # Mock data
│   └── server.js            # Express server
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Stripe account (for payments)
- SMTP credentials (for emails)

### Installation

1. **Clone the repository**
```bash
cd findyy
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install --legacy-peer-deps
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install --legacy-peer-deps
```

4. **Configure Environment Variables**

Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/findyy
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STRIPE_SECRET_KEY=sk_test_your-stripe-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5176
```

5. **Start Development Servers**

**Option 1: Start Both (Easiest)**
```bash
./start-all.sh
```

**Option 2: Start Separately**

Terminal 1 - Backend:
```bash
./start-backend.sh
# OR
cd backend && npm start
```

Terminal 2 - Frontend:
```bash
./start-frontend.sh
# OR
cd frontend && npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5176
- Backend API: http://localhost:5001
- API Health: http://localhost:5001/api/health

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (Protected)
- `PUT /api/listings/:id` - Update listing (Protected)
- `DELETE /api/listings/:id` - Delete listing (Protected)

### Search
- `GET /api/search?q=query` - Simple text search
- `GET /api/search/advanced` - Advanced search with filters

### Favorites
- `POST /api/favorites` - Add to favorites (Protected)
- `DELETE /api/favorites/:listingId` - Remove from favorites (Protected)
- `GET /api/favorites` - Get user's favorites (Protected)
- `GET /api/favorites/check/:listingId` - Check if favorited (Protected)

### Reviews
- `POST /api/reviews` - Create review (Protected)
- `GET /api/reviews/listing/:listingId` - Get listing reviews

### Messages
- `GET /api/messages/conversations` - Get user's conversations (Protected)
- `GET /api/messages/conversation/:conversationId` - Get messages (Protected)
- `POST /api/messages/conversation` - Create/get conversation (Protected)
- `POST /api/messages` - Send message (Protected)

### Payments
- `POST /api/payments/create-intent` - Create payment intent (Protected)
- `POST /api/payments/confirm` - Confirm payment (Protected)
- `GET /api/payments` - Get payment history (Protected)

### Uploads
- `POST /api/upload/single` - Upload single image (Protected)
- `POST /api/upload/multiple` - Upload multiple images (Protected)

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication. Protected routes require a Bearer token in the Authorization header:

```javascript
Authorization: Bearer <token>
```

Tokens are stored in `localStorage` and automatically included in API requests.

## 💬 Real-time Messaging

Socket.io is used for real-time messaging. The client connects automatically when authenticated:

```javascript
const socket = io('http://localhost:5001', {
  auth: { token: userToken }
});
```

Events:
- `send_message` - Send a message
- `new_message` - Receive new message
- `message_notification` - Notification for new message
- `typing` - Typing indicator

## 💳 Payment Integration

Stripe is integrated for payment processing. The flow:

1. Create payment intent: `POST /api/payments/create-intent`
2. Confirm payment on frontend using Stripe.js
3. Confirm payment: `POST /api/payments/confirm`

## 📧 Email Notifications

Email service is configured with Nodemailer. Emails are sent for:
- Welcome emails on registration
- New message notifications
- Listing inquiry notifications

## 🎨 Design System

### Colors
- **Background**: `#000000` (Black)
- **Text**: `#FFFFFF` (White)
- **Accents**: `rgba(255, 255, 255, 0.1-0.4)` (White with opacity)

### Typography
- **Font**: Inter Tight
- **Headings**: Bold, uppercase, large sizes
- **Body**: Regular weight, readable sizes

### Animations
- **Hover**: Scale, translate, opacity changes
- **Scroll**: GSAP ScrollTrigger animations
- **Page Transitions**: Framer Motion AnimatePresence

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variables

### Backend (Heroku/Railway/Render)
1. Set all environment variables
2. Deploy Node.js app
3. Configure MongoDB Atlas connection
4. Update CORS settings for production frontend URL

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for ADYPU Campus, Pune, India**
