Certainly! Below is a **Claude AI prompt (Markdown format)** specifically focused on **enabling user login using email and password only**, following a **modular Node.js + TypeScript + Prisma backend** structure.

---

# 🔐 Claude Prompt: Login with Email & Password Only (Node.js + TS + PostgreSQL)

## 🎯 Objective

Implement a **secure email/password-based login system** using:

* Node.js with TypeScript
* Express.js
* Prisma ORM (PostgreSQL)
* bcrypt for password hashing
* JWT (stored in HTTP-only cookies)

---

## 🛠️ BACKEND INSTRUCTIONS

---

### 🧬 Prisma User Model

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### 🔑 Login API Details

* **Route**: `POST /api/auth/login`
* **Request Body**:

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

---

### 🔍 Validations

Use a schema (`zod` or manual) to validate:

* `email` is required and must be in proper email format
* `password` is required and must be at least 6 characters

---

### 🔁 Login Flow

1. Validate the input request body.
2. Query database for user by `email`.

   * If user not found → return `401 Unauthorized`.
3. Use `bcrypt.compare()` to check if password matches hashed password.

   * If mismatch → return `401 Unauthorized`.
4. On success:

   * Generate a JWT using `jsonwebtoken`.
   * Set JWT in an **HTTP-only cookie**:

     * `name=token`
     * `httpOnly: true`
     * `sameSite: "lax"`
     * `secure: process.env.NODE_ENV === "production"`
   * Return success status and user profile data if needed.

---

### ✅ Expected Response (on success)

```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

---

### 🚫 Failure Response (email not found or password mismatch)

```json
{
  "error": "Invalid email or password"
}
```

---

### 🧠 Environment Variables (`.env`)

```
PORT=8000
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
JWT_SECRET=your-super-secret
```

---

## 📄 FRONTEND INSTRUCTIONS (Next.js + Axios)

### 🧾 Page: `/login`

2. On form submission:

   * Call `POST http://localhost:8000/api/auth/login`
   * Use Axios with `withCredentials: true`

3. If login is successful:

   * Redirect to `/dashboard`
   * Frontend will not manage the token (JWT is stored in HTTP-only cookie)

---

### ⚙️ Axios Setup

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});
```

---

## ✅ Requirements Summary

* [x] Email must be unique (enforced via Prisma).
* [x] Passwords must be securely hashed (`bcrypt`).
* [x] JWT must be stored in **HTTP-only cookies**.
* [x] Only valid users should receive a token.
* [x] Login system must reject invalid credentials.
* [x] Fully modular TypeScript backend structure.

