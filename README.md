# 🏛️ Hallify – Mahal / Event Hall Booking Platform

Hallify is a **full-stack web application** that simplifies the process of **discovering, managing, and booking mahals (event halls)** for occasions such as weddings, receptions, and corporate events.

The platform allows users to explore halls based on availability, view detailed information, and make bookings, while hall owners can manage listings efficiently.

---

## 🚀 Features

### 👥 User Features
- **OTP Verification**: Secure verification for signups and logins.
- Browse available mahals with real-time status.
- View hall details (capacity, pricing, location, amenities).
- Check availability by date and book instantly.
- View personal booking history and profile management.

### 🏢 Hall Owner Features
- Add and manage hall listings with rich details.
- Update availability and pricing in real-time.
- View and manage incoming bookings for their halls.

### 👑 Admin Dashboard
- **User Management**: View all registered users and their details.
- **Role Control**: Promote users to Owners or Admins.
- **Account Management**: Securely delete users when necessary.
- System-wide overview and auditing.

### 🔐 System Features
- **Secure Authentication**: JWT-based auth with OTP verification.
- **Role-Based Access Control (RBAC)**: Distinct permissions for User, Owner, and Admin.
- **RESTful APIs**: Well-structured and documented endpoints.
- **Responsive UI**: Seamless experience across devices.

---

## 🛠 Tech Stack

### 🌐 Frontend
- **React** (Vite)
- **Tailwind CSS**
- Axios & React Router

### ⚙️ Backend
- **Node.js** & **Express.js**
- REST API architecture
- **Nodemailer** (for OTP delivery)

### 🗄️ Database
- **Supabase (PostgreSQL)**
- SQL-based relational management

### 🔧 Tools & Platforms
- **Bruno** (API testing & documentation)
- Git & GitHub
- Supabase Cloud

---

## 📂 Project Structure

### 🌐 Client (Frontend)
```text
client/
│── src/
│   ├── components/  # Reusable UI elements
│   ├── pages/       # Page-level components
│   ├── services/    # API calling logic
│   ├── hooks/       # Custom React hooks
│   └── utils/       # Helper functions
│── App.jsx
│── index.css
│── package.json
```

### ⚙️ Server (Backend)
```text
server/
│── controllers/  # Business logic
│── routes/       # API endpoints
│── models/       # Database schemas/queries
│── middleware/   # Auth & Validation
│── scripts/      # Database initialization scripts
│── index.js      # Entry point
│── package.json
```

### 🧪 API Testing
```text
mahal/            # Bruno collection for API testing
```

---

## ⚙️ Installation & Setup

#### 1️⃣ Clone the Repository
```text 
git clone https://github.com/your-username/hallify.git
cd hallify
```

#### 2️⃣ Client Setup
```text
cd client
npm install
npm run dev
```

#### 3️⃣ Server Setup
```text
cd server
npm install
npm run dev
```

### 🔑 Environment Variables

Create a `.env` file in the `server` folder:
```text
PORT=5000
DATABASE_URL=your_supabase_postgresql_url
JWT_SECRET=your_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_app_password
```

---

#### 🎯 Use Case Example
- A user searches for a mahal for a wedding.
- Hallify displays available halls with pricing and capacity.
- The user selects a date and confirms the booking after OTP verification.
- The hall owner receives booking details and manages the schedule.

#### 🔮 Future Enhancements
- [ ] Online payment integration (Stripe/Razorpay)
- [ ] Reviews & ratings system
- [ ] Advanced search filters (distance, budget range)
- [ ] Push notifications for booking updates
