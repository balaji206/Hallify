# 🏛️ Hallify – Mahal / Event Hall Booking Platform

Hallify is a **full-stack web application** that simplifies the process of **discovering, managing, and booking mahals (event halls)** for occasions such as weddings, receptions, and corporate events.

The platform allows users to explore halls based on availability, view detailed information, and make bookings, while hall owners can manage listings efficiently.

---

## 🚀 Features

### 👥 User Features
- User authentication (Signup / Login)
- Browse available mahals
- View hall details (capacity, pricing, location, amenities)
- Check availability by date
- Book halls for specific dates
- View booking history

### 🏢 Hall Owner Features
- Add new hall listings
- Update hall details
- Manage availability
- View and manage bookings

### 🔐 System Features
- Secure authentication
- Role-based access (User / Owner)
- RESTful APIs
- Responsive UI

---

## 🛠 Tech Stack

### 🌐 Frontend
- **React**
- **Tailwind CSS**
- Axios
- React Router

### ⚙️ Backend
- **Node.js**
- **Express.js**
- REST API architecture

### 🗄️ Database
- **MongoDB**
- Mongoose ODM

### 🔧 Tools & Platforms
- Git & GitHub
- Postman (API testing)
- MongoDB Atlas

---

## 📂 Project Structure

### 🌐 Frontend

```text
frontend/
│── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│── App.jsx
│── index.css
│── tailwind.config.js
│── package.json
```
### ⚙️ Backend

```text
backend/
│── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── config/
│── server.js
│── package.json
```

### ⚙️ Installation & Setup
#### 1️⃣ Clone the Repository

```text 
git clone https://github.com/your-username/hallify.git
cd hallify
```

#### 2️⃣ Frontend Setup

```text
cd frontend
npm install
npm run dev
```

#### 3️⃣ Backend Setup

```text
cd backend
npm install
npm run dev
```

### 🔑 Environment Variables

- Create a .env file in the backend folder:
```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

#### 🎯 Use Case Example

- A user searches for a mahal for a wedding.

- Hallify displays available halls with pricing and capacity.

- The user selects a date and confirms the booking.

- The hall owner receives booking details.

#### 🔮 Future Enhancements

- Online payment integration

- Reviews & ratings

- Admin dashboard

- Advanced search & filters

- Email / SMS notifications
