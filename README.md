# 🏋️ GearUp API

> **Rent Sports & Outdoor Gear Instantly**

GearUp is a RESTful backend API for a sports and outdoor equipment rental platform. Customers can browse and rent gear, providers can manage their inventory, and admins oversee the platform.

> 🚧 **Project Status:** In Progress

---

# 🚀 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcryptjs
- Cookie Parser
- HTTP Status
- ESLint + Prettier

---

# 📁 Project Structure

```text
src/
│
├── app/
│   ├── config/
│   ├── errors/
│   ├── lib/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── category/
│   │   ├── gear/
│   │   └── rental/
│   │
│   ├── routes/
│   ├── utils/
│   └── app.ts
│
├── generated/
└── server.ts
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

---

# 🔐 Authentication

JWT Authentication

Supported authentication methods

### Authorization Header

```
Bearer <token>
```

or

```
<token>
```

### Cookies

```
accessToken=<jwt>
```

---

# 👤 User Roles

| Role | Permission |
|------|------------|
| CUSTOMER | Browse & Rent Gear |
| PROVIDER | Manage Own Gear & Orders |
| ADMIN | Platform Management |

---

# 📌 Implemented Features

## ✅ Authentication Module

- User Registration
- Login
- JWT Access Token
- Protected Routes
- Role Based Authorization

---

## ✅ User Module

### Endpoints

| Method | Endpoint |
|--------|----------|
| POST | /api/users/register |
| GET | /api/users/me |
| PUT | /api/users/my-profile |

### Features

- Register User
- Auto Create Profile
- Update Profile
- Get Current User

---

## ✅ Category Module

### Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/categories | Admin |
| GET | /api/categories | Public |
| GET | /api/categories/:id | Public |
| PATCH | /api/categories/:id | Admin |
| DELETE | /api/categories/:id | Admin |

### Features

- Create Category
- View Categories
- Update Category
- Delete Category

---

## ✅ Gear Module

### Public Endpoints

| Method | Endpoint |
|--------|----------|
| GET | /api/gear |
| GET | /api/gear/:id |

### Provider Endpoints

| Method | Endpoint |
|--------|----------|
| POST | /api/provider/gear |
| GET | /api/provider/gear |
| PATCH | /api/provider/gear/:id |
| DELETE | /api/provider/gear/:id |

### Features

- Create Gear
- Update Own Gear
- Delete Own Gear
- Get Own Inventory
- Get Single Gear
- Search by Name, Description & Brand
- Filter by Category
- Filter by Brand
- Filter by Availability
- Filter by Price Range
- Sorting
- Pagination with Metadata

---

## ✅ Rental Order Module

### Customer Endpoints

| Method | Endpoint |
|--------|----------|
| POST | /api/rentals |
| GET | /api/rentals |
| GET | /api/rentals/:id |

### Provider Endpoints

| Method | Endpoint |
|--------|----------|
| GET | /api/rentals/provider/orders |
| GET | /api/rentals/provider/orders/:id |
| PATCH | /api/rentals/provider/orders/:id |

### Features

#### Customer

- Create Rental Order
- Calculate Rental Duration
- Calculate Total Rental Cost
- Reduce Available Gear Quantity
- Automatically Mark Gear Unavailable When Stock Becomes Zero
- View Rental History
- View Rental Details

#### Provider

- View Incoming Rental Orders
- View Single Rental Order
- Update Rental Status
- Ownership Validation
- Rental Status Transition Validation

---

# 🔒 Authorization Rules

## Customer

- View Categories
- Browse Gear
- Create Rental
- View Own Rentals

---

## Provider

- Manage Own Gear
- View Incoming Orders
- Update Rental Status

---

## Admin

- Manage Categories

---

# 🛡️ Security

- Password Hashing (bcrypt)
- JWT Authentication
- Protected Routes
- Role Based Authorization
- Resource Ownership Validation
- Rental Status Validation
- Prisma Transactions
- Global Error Handling

---

# 📂 Current API Summary

## Authentication

```
POST   /api/auth/login
```

---

## Users

```
POST   /api/users/register

GET    /api/users/me

PUT    /api/users/my-profile
```

---

## Categories

```
POST   /api/categories

GET    /api/categories

GET    /api/categories/:id

PATCH  /api/categories/:id

DELETE /api/categories/:id
```

---

## Gear

### Public

```
GET    /api/gear

GET    /api/gear/:id
```

### Provider

```
POST   /api/provider/gear

GET    /api/provider/gear

PATCH  /api/provider/gear/:id

DELETE /api/provider/gear/:id
```

---

## Rental Orders

### Customer

```
POST   /api/rentals

GET    /api/rentals

GET    /api/rentals/:id
```

### Provider

```
GET    /api/rentals/provider/orders

GET    /api/rentals/provider/orders/:id

PATCH  /api/rentals/provider/orders/:id
```

---

# 🚧 Upcoming Features

- Payment Module (Stripe / SSLCommerz)
- Payment History
- Reviews
- Admin Module
- Dashboard Analytics
- API Validation (Zod)
- Swagger API Documentation

---

# 👨‍💻 Author

**Sanjit Sarkar**

Full Stack Developer

**Tech Stack**

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM

---

# 📜 License

This project is developed for educational purposes as part of a Backend Development Assignment.