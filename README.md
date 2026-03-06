# Subscription-Based Backend System

## Overview

This project is a **subscription-based backend system** built using **Node.js, Express, and MySQL**.
It provides authentication, subscription management, automated subscription expiry, and admin analytics.

The system simulates how real **SaaS platforms** manage users, subscriptions, and revenue analytics.

---

## Tech Stack

* **Node.js**
* **Express.js**
* **MySQL**
* **JWT (JSON Web Tokens)** for authentication
* **bcrypt** for password hashing
* **node-cron** for automated background jobs
* **dotenv** for environment configuration

---

## Features

### Authentication

* User registration
* User login
* Password hashing with bcrypt
* JWT-based authentication

### Authorization

* Protected routes using middleware
* Role-Based Access Control (RBAC)
* Admin-only endpoints for analytics

### Subscription Management

* Create subscription plans
* Check subscription status
* Automatic subscription expiry using cron jobs

### Revenue Analytics (Admin)

* Total revenue calculation
* Active subscriptions count
* Expired subscriptions count
* Monthly revenue analytics

---

## Project Structure

subscription-backend
│
├── config
│   └── db.js
│
├── controllers
│   ├── authController.js
│   └── subscriptionController.js
│
├── middleware
│   ├── authMiddleware.js
│   └── adminMiddleware.js
│
├── routes
│   ├── authRoutes.js
│   └── subscriptionRoutes.js
│
├── jobs
│   └── expireSubscriptions.js
│
├── server.js
├── package.json
├── .env
└── README.md

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/subscription-backend.git
cd subscription-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=subscription_db
PORT=5000
JWT_SECRET=supersecretkey
```

### 4. Start the server

```bash
npm run dev
```

or

```bash
node server.js
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user'
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  plan ENUM('Free','Basic','Premium'),
  start_date DATETIME,
  end_date DATETIME,
  status VARCHAR(20) DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Payments Table

```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(10,2),
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## API Endpoints

### Authentication

Register user

POST /api/auth/register

Example request:

```json
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "password123"
}
```

Login user

POST /api/auth/login

```json
{
  "email": "john@test.com",
  "password": "password123"
}
```

---

### Subscription Endpoints

Create subscription

POST /api/subscription/create

Headers:

Authorization: Bearer TOKEN

```json
{
  "plan": "Basic"
}
```

Check subscription status

GET /api/subscription/status

Headers:

Authorization: Bearer TOKEN

---

### Admin Analytics

Total revenue statistics

GET /api/subscription/admin/revenue

Headers:

Authorization: Bearer ADMIN_TOKEN

Example response:

```json
{
  "totalRevenue": 100,
  "activeSubscriptions": 2,
  "expiredSubscriptions": 1
}
```

Monthly revenue analytics

GET /api/subscription/admin/revenue/monthly

Headers:

Authorization: Bearer ADMIN_TOKEN

Example response:

```json
[
  {
    "month": "2026-03",
    "revenue": 100
  }
]
```

---

## Automated Subscription Expiry

The system uses **node-cron** to automatically expire subscriptions.

Cron job runs daily:

```javascript
cron.schedule("0 0 * * *", () => {
  // update expired subscriptions
});
```

If the subscription end date has passed:

```
status → expired
```

---

## Security Features

* Password hashing using **bcrypt**
* **JWT authentication**
* **Protected routes using middleware**
* **Role-Based Access Control (RBAC)**
* Environment variables using **dotenv**

---

## Future Improvements

Possible enhancements:

* Payment gateway integration (Stripe / PayPal)
* Subscription upgrade/downgrade
* Email notifications for expiring subscriptions
* Rate limiting and API security
* Admin dashboard frontend
* API documentation using Swagger

---

## Author

**Nondumiso Shange**

Software Development Student | Backend Developer

GitHub: https://github.com/yourusername
