# 🏋️ GearUp API

> **Rent Sports & Outdoor Gear Instantly**

GearUp is a RESTful backend API for a sports and outdoor equipment rental platform. Customers can browse and rent gear, providers can manage their inventory, and admins oversee the platform.

> 🚧 **Project Status:** In Progress

---

# 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **JWT Authentication**
- **bcryptjs**
- **Cookie Parser**
- **HTTP Status**
- **ESLint + Prettier**

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
│   │
│   ├── auth/
│   ├── user/
│   ├── category/
│   └── gear/
│
│   ├── routes/
│   ├── utils/
│   └── app.ts
│
├── server.ts
└── generated/
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

---

# 🔐 Authentication

JWT Authentication

Supported authentication methods

- Authorization Header

```
Bearer <token>
```

or

```
<token>
```

- HTTP Cookies

```
accessToken=<jwt>
```

---

# 👤 User Roles

| Role     | Permission          |
| -------- | ------------------- |
| CUSTOMER | Browse & Rent Gear  |
| PROVIDER | Manage Own Gear     |
| ADMIN    | Platform Management |

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

| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| POST   | /api/users/register   | Register User     |
| GET    | /api/users/me         | Get My Profile    |
| PUT    | /api/users/my-profile | Update My Profile |

### Features

- Register User
- Create Profile Automatically
- Update Profile
- Get Current User

---

## ✅ Category Module

### Endpoints

| Method | Endpoint            | Access |
| ------ | ------------------- | ------ |
| POST   | /api/categories     | Admin  |
| GET    | /api/categories     | Public |
| GET    | /api/categories/:id | Public |
| PATCH  | /api/categories/:id | Admin  |
| DELETE | /api/categories/:id | Admin  |

### Features

- Create Category
- Get All Categories
- Get Single Category
- Update Category
- Delete Category

---

## ✅ Gear Module

### Public Endpoints

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| GET    | /api/gear     | Public |
| GET    | /api/gear/:id | Public |

---

### Provider Endpoints

| Method | Endpoint               | Access   |
| ------ | ---------------------- | -------- |
| POST   | /api/provider/gear     | Provider |
| PATCH  | /api/provider/gear/:id | Provider |
| DELETE | /api/provider/gear/:id | Provider |
| GET    | /api/provider/gear     | Provider |

---

### Features

- Create Gear
- Get All Gear
- Get Single Gear
- Update Own Gear
- Delete Own Gear
- View Own Gear Inventory

---

# 🔒 Authorization Rules

### Customer

- View Gear
- View Categories

---

### Provider

- Create Gear
- Update Own Gear
- Delete Own Gear
- View Own Gear

---

### Admin

- Manage Categories

---

# 🛡️ Security

- Password Hashing using bcrypt
- JWT Authentication
- Protected Routes
- Role Based Authorization
- Ownership Validation
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

PATCH /api/categories/:id

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

# 🚧 Upcoming Features

- Rental Order Module
- Payment Module (Stripe / SSLCommerz)
- Reviews
- Search
- Filtering
- Pagination
- Sorting
- Provider Dashboard
- Admin Dashboard
- Analytics

---

# 👨‍💻 Author

**Sanjit Sarkar**

Full Stack Developer (Node.js | Express | TypeScript | PostgreSQL | Prisma)

---

# 📜 License

This project is developed for educational purposes as part of a Backend Development Assignment.
