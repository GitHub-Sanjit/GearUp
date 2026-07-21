# 🏋️ GearUp API

> **Rent Sports & Outdoor Gear Instantly**

GearUp is a production-ready RESTful Backend API for a sports and outdoor equipment rental platform. Customers can browse and rent equipment, providers can manage their inventory and rental orders, while administrators oversee the entire platform. The API includes secure JWT authentication, role-based authorization, Stripe payment integration, and PostgreSQL with Prisma ORM.

---

# 🔗 Resources

| Resource                                   | Link                                                                               |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| **Backend Repository**                     | https://github.com/GitHub-Sanjit/GearUp                                            |
| **Live API**                               | https://gearup-zk8c.onrender.com                                                   |
| **API Documentation (Postman Collection)** | https://drive.google.com/file/d/1ElKHE2zImyKhMOB1rCjoVbaGIQxEtqHU/view?usp=sharing |
| **API Environment Variables**              | https://drive.google.com/file/d/1sxZMlfCMAEsho1-XSU7RMwL7i6A1PrMq/view?usp=sharing |
| **ERD Diagram**                            | https://drive.google.com/file/d/1KCkFcaPa9Iq7tRT9KUmHXgEGQ3sxd6g_/view?usp=sharing |

---

# 🚀 Tech Stack

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Stripe Payment Gateway
* bcryptjs
* Cookie Parser
* Zod Validation
* HTTP Status
* ESLint
* Prettier

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/GitHub-Sanjit/GearUp.git
```

Move into the project directory

```bash
cd GearUp
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev
```

Start the development server

```bash
npm run dev
```

---

# 🌱 Environment Variables

Create a `.env` file in the project root.

```env
PORT=

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

APP_URL=
```

---

# 📁 Project Structure

```text
src/
│
├── config/
├── errors/
├── lib/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── category/
│   ├── gear/
│   ├── rental/
│   └── payment/
│
├── utils/
├── app.ts
└── server.ts

generated/
```

---

# 🗄️ Database Models

## User

* id
* name
* email
* password
* role
* activeStatus
* createdAt
* updatedAt

### Relations

* One User has one Profile
* One Provider has many Gear
* One Customer has many Rental Orders

---

## Profile

* id
* profilePhoto
* bio
* userId

---

## Category

* id
* name
* description
* createdAt
* updatedAt

### Relations

* One Category has many Gear

---

## Gear

* id
* name
* description
* brand
* image
* dailyRentalPrice
* stockQuantity
* availableQuantity
* condition
* isAvailable
* providerId
* categoryId
* createdAt
* updatedAt

### Relations

* Belongs to one Provider
* Belongs to one Category
* Has many Rental Orders

---

## Rental Order

* id
* customerId
* gearId
* quantity
* startDate
* endDate
* totalDays
* totalAmount
* status
* isPaid
* createdAt
* updatedAt

### Relations

* Belongs to one Customer
* Belongs to one Gear
* Has one Payment

---

## Payment

* id
* rentalOrderId
* amount
* provider
* status
* stripeCustomerId
* stripeSessionId
* transactionId
* paidAt
* createdAt
* updatedAt

### Relations

* One Payment belongs to one Rental Order

---

# 🔐 Authentication

The API uses JWT Authentication.

Supported Authorization methods:

### Authorization Header

```text
Bearer <access_token>
```

or

```text
<access_token>
```

### Cookies

```text
accessToken=<jwt>
```

---

# 👥 User Roles

| Role     | Description                                                     |
| -------- | --------------------------------------------------------------- |
| CUSTOMER | Browse gear, create rental orders, make payments                |
| PROVIDER | Manage own gear inventory and rental orders                     |
| ADMIN    | Manage users, categories, gear, rentals and platform operations |

---

# 📌 API Modules

## Authentication

| Method | Endpoint        |
| ------ | --------------- |
| POST   | /api/auth/login |

**Features**

* Secure Login
* JWT Authentication
* Role-Based Authorization
* Protected Routes

---

## Users

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /api/users/register   |
| GET    | /api/users/me         |
| PUT    | /api/users/my-profile |

**Features**

* User Registration
* Automatic Profile Creation
* Profile Update
* Current User Information

---

## Categories

| Method | Endpoint            | Access |
| ------ | ------------------- | ------ |
| POST   | /api/categories     | Admin  |
| GET    | /api/categories     | Public |
| GET    | /api/categories/:id | Public |
| PATCH  | /api/categories/:id | Admin  |
| DELETE | /api/categories/:id | Admin  |

---

## Gear

### Public

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /api/gear     |
| GET    | /api/gear/:id |

### Provider

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | /api/provider/gear     |
| GET    | /api/provider/gear     |
| PATCH  | /api/provider/gear/:id |
| DELETE | /api/provider/gear/:id |

**Features**

* CRUD Operations
* Inventory Management
* Search
* Filtering
* Sorting
* Pagination
* Ownership Validation

---

## Rental Orders

### Customer

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /api/rentals     |
| GET    | /api/rentals     |
| GET    | /api/rentals/:id |

### Provider

| Method | Endpoint                         |
| ------ | -------------------------------- |
| GET    | /api/rentals/provider/orders     |
| GET    | /api/rentals/provider/orders/:id |
| PATCH  | /api/rentals/provider/orders/:id |

**Features**

* Rental Duration Calculation
* Rental Cost Calculation
* Inventory Availability Management
* Rental Status Workflow
* Ownership Validation

---

## Payments (Stripe)

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | /api/payments/checkout       |
| POST   | /api/payments/webhook        |
| GET    | /api/payments/my-payments    |
| GET    | /api/payments/admin/payments |

**Features**

* Stripe Checkout Session
* Secure Webhook Verification
* Automatic Payment Record Creation
* Rental Payment Status Update
* Payment History
* Transaction Management

---

## Admin

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/admin/users     |
| PATCH  | /api/admin/users/:id |
| GET    | /api/admin/gears     |
| GET    | /api/admin/rentals   |

**Features**

* User Management
* Activate / Suspend Users
* Platform-wide Gear Management
* Platform-wide Rental Management

---

# 🔑 Demo Admin Account

| Email                                       | Password |
| ------------------------------------------- | -------- |
| [admin@gearup.com](mailto:admin@gearup.com) | admin123 |

---

# 📦 API Response Format

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errorDetails": {}
}
```

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing (bcrypt)
* Role-Based Authorization
* Ownership Validation
* Stripe Webhook Signature Verification
* Prisma Transactions
* Request Validation using Zod
* Centralized Error Handling

---

# ✨ API Features

* Authentication & Authorization
* Search
* Filtering
* Sorting
* Pagination
* Stripe Payment Integration
* Inventory Management
* Transaction Rollback using Prisma Transactions
* Consistent API Response Structure
* Global Error Handling

---

# 🚀 Future Improvements

* Reviews & Ratings
* Wishlist
* Notifications
* Dashboard Analytics
* Swagger / OpenAPI Documentation
* Docker Support
* CI/CD Pipeline

---

# 👨‍💻 Author

**Sanjit Sarkar**

Full Stack Developer

### Technologies

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM

---

# 📄 License

This project was developed for educational purposes as part of a Backend Development Assignment.
