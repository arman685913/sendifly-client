# 🚀 SendiFly - Parcel Delivery System

## 🔗 Live Links

-   🌐 Client: [https://sandi-fly.web.app/]
-   🖥️ Server: [https://sendi-fly-server.vercel.app]
-   📦 Requirement :  [https://docs.google.com/document/d/1zZu8-3UEebDQbN2RST5mLFazweFIMWu8QIEABFFBUwg/edit?tab=t.0#heading=h.ckkmvzl7ibdm]

## 📂 Repositories

-   Frontend: [https://github.com/arman685913/sendifly-client.git]
-   Backend: [https://github.com/arman685913/sendifly-server.git]

------------------------------------------------------------------------

## 📦 Overview

SendiFly is a full-stack parcel delivery system designed for efficient
logistics management. It supports real-time tracking, secure payments,
and role-based dashboards for Users, Admins, and Riders.

------------------------------------------------------------------------

## 👥 User Roles

### 🧑 User

-   Create parcel bookings
-   Make payments
-   Track parcels
-   Leave reviews

### 🛠️ Admin

-   Manage users & riders
-   Assign delivery tasks
-   Monitor system operations

### 🚚 Rider

-   Pickup parcels
-   Deliver parcels
-   Update delivery status
-   Earn per task

------------------------------------------------------------------------

## ⚙️ Tech Stack

### Frontend

-   React.js
-   Tailwind CSS
-   React Router
-   TanStack Query
-   Axios

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Firebase Admin SDK

------------------------------------------------------------------------

## 🔐 Features

-   🔑 Authentication & Authorization
-   📦 Parcel Management System
-   💳 Secure Payment Integration
-   📍 Real-time Tracking System
-   📊 Dashboard with Charts
-   ⭐ Review & Rating System

------------------------------------------------------------------------

## 📁 Environment Variables

Create a `.env` file in backend:

    PORT=5000
    DB_USER=your_db_user
    DB_PASS=your_db_pass
    FIREBASE_PROJECT_ID=xxx
    FIREBASE_CLIENT_EMAIL=xxx
    FIREBASE_PRIVATE_KEY=your_private_key

------------------------------------------------------------------------

## 🚀 Installation

### 1️⃣ Clone Repository

    git clone https://github.com/arman685913/sendifly-server.git
    cd sendifly-server

### 2️⃣ Install Dependencies

    npm install

### 3️⃣ Run Server

    npm run dev

------------------------------------------------------------------------

## 📌 API Endpoints

### Parcels

-   GET /parcels
-   POST /parcels
-   PATCH /parcels/:id

### Payments

-   POST /payments

### Tracking

-   GET /tracking
-   POST /tracking

------------------------------------------------------------------------

## 🧠 Key Concepts

-   Role-based routing
-   Protected API routes
-   Status-driven delivery flow
-   Real-time UI updates

------------------------------------------------------------------------

## ⚠️ Security Notes

-   Never commit `.env` files
-   Keep Firebase keys secure
-   Use environment variables in production

------------------------------------------------------------------------

## ✨ Author

**Arman Farazi**

------------------------------------------------------------------------
