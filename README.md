# 🏋️ GearUp API

> **Rent Sports & Outdoor Gear Instantly**

GearUp is a RESTful Backend API for a sports and outdoor equipment rental platform. Customers can browse and rent gear, providers can manage inventory and rental orders, while administrators oversee the entire platform.

> 🚀 **Project Status:** Completed Backend API

---

# 🚀 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Stripe Payment Gateway
- bcryptjs
- Cookie Parser
- HTTP Status
- ESLint
- Prettier

---

# 📁 Project Structure

```text
src/
│
├── config/
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

- id
- name
- email
- password
- role
- activeStatus
- createdAt
- updatedAt

### Relations

- One User has one Profile
- One Provider has many Gear
- One Customer has many Rental Orders

---

## Profile

- id
- profilePhoto
- bio
- userId

---

## Category

- id
- name
- description
- createdAt
- updatedAt

### Relations

- One Category has many Gear

---

## Gear

- id
- name
- description
- brand
- image
- dailyRentalPrice
- stockQuantity
- availableQuantity
- condition
- isAvailable
- providerId
- categoryId
- createdAt
- updatedAt

### Relations

- Belongs to one Provider
- Belongs to one Category
- Has many Rental Orders

---

## Rental Order

- id
- customerId
- gearId
- quantity
- startDate
- endDate
- totalDays
- totalAmount
- status
- isPaid
- createdAt
- updatedAt

### Relations

- Belongs to one Customer
- Belongs to one Gear
- Has one Payment

---

## Payment

- id
- rentalOrderId
- amount
- provider
- status
- stripeCustomerId
- stripeSessionId
- transactionId
- paidAt
- createdAt
- updatedAt

### Relations

- One Payment belongs to one Rental Order

---

# 🔐 Authentication

JWT Authentication

Supported methods

### Authorization Header

```
Bearer <access_token>
```

or

```
<access_token>
```

### Cookies

```
accessToken=<jwt>
```

---

# 👥 User Roles

| Role     | Permissions                                |
| -------- | ------------------------------------------ |
| CUSTOMER | Browse Gear, Rent Equipment, Make Payments |
| PROVIDER | Manage Own Gear & Rental Orders            |
| ADMIN    | Manage Users, Gear, Rentals & Categories   |

---

# 📌 Implemented Modules

## ✅ Authentication

| Method | Endpoint        |
| ------ | --------------- |
| POST   | /api/auth/login |

### Features

- Secure Login
- JWT Authentication
- Protected Routes
- Role Based Authorization

---

## ✅ Users

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /api/users/register   |
| GET    | /api/users/me         |
| PUT    | /api/users/my-profile |

### Features

- User Registration
- Automatic Profile Creation
- Update Profile
- Get Current User

---

## ✅ Categories

| Method | Endpoint            | Access |
| ------ | ------------------- | ------ |
| POST   | /api/categories     | Admin  |
| GET    | /api/categories     | Public |
| GET    | /api/categories/:id | Public |
| PATCH  | /api/categories/:id | Admin  |
| DELETE | /api/categories/:id | Admin  |

---

## ✅ Gear

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

### Features

- CRUD Operations
- Inventory Management
- Search
- Filtering
- Price Range Filter
- Sorting
- Pagination
- Ownership Validation

---

## ✅ Rental Orders

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

### Features

- Create Rental Orders
- Rental Cost Calculation
- Rental Duration Calculation
- Gear Availability Management
- Rental Status Workflow
- Ownership Validation

---

## ✅ Payments (Stripe)

| Method | Endpoint                              |
| ------ | ------------------------------------- |
| POST   | /api/payments/checkout/:rentalOrderId |
| POST   | /api/payments/webhook                 |
| GET    | /api/payments/my-history              |

### Features

- Stripe Checkout Session
- Secure Webhook Verification
- Automatic Payment Record Creation
- Rental Payment Status Update
- Transaction History

---

## ✅ Admin

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/admin/users     |
| PATCH  | /api/admin/users/:id |
| GET    | /api/admin/gears     |
| GET    | /api/admin/rentals   |

### Features

- User Management
- Suspend / Activate Users
- Platform-wide Gear Management
- Platform-wide Rental Management

---

# 🔒 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Role Based Authorization
- Ownership Validation
- Rental Status Validation
- Stripe Webhook Signature Verification
- Prisma Transactions
- Global Error Handling

---

# ✨ API Features

- Authentication
- Authorization
- Search
- Filtering
- Sorting
- Pagination
- Stripe Payment Integration
- Transaction Rollback (Prisma Transaction)
- Consistent API Response Format
- Centralized Error Handling

---

# 🚧 Future Improvements

- Reviews & Ratings
- Wishlist
- Notifications
- Dashboard Analytics
- Swagger Documentation
- Zod Validation
- Refresh Token Authentication
- Docker Support
- CI/CD Pipeline

---

# 👨‍💻 Author

**Sanjit Sarkar**

Full Stack Developer

### Technologies

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM

---

# 📜 License

This project was developed for educational purposes as part of a Backend Development Assignment.
