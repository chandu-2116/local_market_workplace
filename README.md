# UrbanFix – Local Services Marketplace

A modern, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application connecting customers with skilled local service providers through a seamless digital marketplace.

---

## 🌟 Key Features

### 1. Three Distinct User Roles
* **Customer**:
  * Discover and search services across 15 categories.
  * Real-time filtering by price, category, and minimum rating.
  * Submit service booking requests with problem details, address, and schedule.
  * Live status tracker timeline (*Pending → Accepted → Work Started → Completed*).
  * Pay securely via **Razorpay Test Mode** (Card, UPI, Cash).
  * Rate and review service providers upon completion.
  * Manage customer profile and saved service addresses.

* **Service Provider**:
  * Professional profile with trade licenses, hourly rate, and experience years.
  * **Incoming Requests Pool**: Pending requests remain visible to all eligible providers in that trade until one accepts.
  * **Atomic Booking Acceptance**: Prevents race conditions so multiple providers cannot claim the same request.
  * Active jobs schedule with customer address, contact phone, and task notes.
  * One-click "Start Work" and "Complete Work" status updates.
  * Real-time earnings tracker and customer feedback overview.
  * Service listing manager and online availability toggle.

* **Administrator**:
  * Platform command center with gross volume, booking pipeline distribution, and user count.
  * **Provider License Verification Queue**: Review submitted documents with Approve / Reject controls.
  * User account management with Activate / Deactivate toggles.
  * Live audit of all platform bookings and transaction states.
  * One-click database re-seed tool for rapid evaluation.

---

## 🛠️ Technology Stack

* **Frontend**: React.js with Vite, JavaScript (JSX), Tailwind CSS, React Router DOM, Axios, Context API, Lucide React icons, React Hot Toast.
* **Backend**: Node.js, Express.js, RESTful APIs, JWT Authentication, bcrypt password hashing, Multer & Cloudinary support.
* **Database**: MongoDB with Mongoose ODM (includes complete schemas and seed script).
* **Payment Integration**: Razorpay Test Mode with test order creation and verification.
* **Real-Time Updates**: Status broadcast polling and notification dispatching.

---

## 🚀 Quick Evaluation Accounts

The top navigation bar contains an **Instant Demo Switcher** button to switch between roles in 1 click, or you can use these pre-seeded accounts:

| Role | Email | Password | Details |
|---|---|---|---|
| **Customer** | `priya@example.com` | `customer123` | Priya Patel (Manhattan, NY) |
| **Provider** | `liam.electric@example.com` | `provider123` | Liam Davis (Master Electrician) |
| **Admin** | `admin@urbanfix.com` | `admin123` | Marcus Vance (Platform Administrator) |

---

## 📦 Local Installation & Running in VS Code

### 1. Clone the repository
```bash
git clone <repository-url>
cd urbanfix
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure the following variables are set:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/urbanfix
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=rzp_test_urbanfix_gateway
```

### 4. (Optional) Seed MongoDB Database
To populate MongoDB with all 15 categories, verified providers, and sample bookings:
```bash
node server/seed/seed.js
```

### 5. Start the Application
Run the full-stack application (starts Express API backend + Vite frontend):
```bash
npm run dev
```

Open your browser at:
```
http://localhost:3000
```

---

## 📡 API Reference Overview

### Authentication
* `POST /api/auth/register` - Create customer or provider account
* `POST /api/auth/login` - Authenticate and receive JWT
* `GET /api/auth/me` - Get current user profile
* `PUT /api/auth/profile` - Update profile & availability

### Services & Categories
* `GET /api/categories` - List 15 core service categories
* `GET /api/services` - List services with keyword, price, and category filters
* `GET /api/services/:id` - Get service details
* `POST /api/services` - Provider adds new service offering

### Booking Lifecycle (Atomic Workflow)
* `POST /api/bookings` - Customer submits service request (status: `Pending`)
* `GET /api/bookings/my-bookings` - Customer retrieves booking history
* `GET /api/bookings/provider-requests` - Provider gets open pool & assigned jobs
* `PATCH /api/bookings/:id/accept` - Provider atomically claims request
* `PATCH /api/bookings/:id/reject` - Provider dismisses request from their feed
* `PATCH /api/bookings/:id/start` - Provider marks `Work Started`
* `PATCH /api/bookings/:id/complete` - Provider marks `Completed`
* `PATCH /api/bookings/:id/cancel` - Cancel booking

### Payments & Reviews
* `POST /api/payments/create-order` - Create Razorpay order
* `POST /api/payments/verify` - Verify transaction and credit provider
* `POST /api/reviews` - Submit star rating & feedback for completed service

### Admin Operations
* `GET /api/admin/dashboard` - Platform statistics & revenue breakdown
* `GET /api/admin/users` - View all users
* `PATCH /api/admin/users/:id/status` - Activate or deactivate user
* `GET /api/admin/providers` - View provider verification documents
* `PATCH /api/admin/providers/:userId/verify` - Approve or reject trade license
* `POST /api/admin/reset-data` - Restore database to initial sample state
