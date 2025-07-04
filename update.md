
# 🤖 Claude AI Prompt: Full Authentication System (Email/Password + Google OAuth)

## 🎯 Goal

Build a secure, scalable authentication system using:

* **Node.js with TypeScript**
* **Express.js**
* **Prisma ORM (PostgreSQL)**
* **Google OAuth (Passport.js)**
* **bcrypt** for password hashing
* **JWT (HTTP-only cookies)**
* **Next.js frontend** using `login-03` and `dashboard-01` ShadCN components

---

## 📂 Instructions for Claude

---

## 🛠️ BACKEND INSTRUCTIONS (Node.js + TypeScript + PostgreSQL + Prisma)

### 🔧 Setup

1. Scaffold the backend project using TypeScript + Express.
2. Add and configure `dotenv`, `cookie-parser`, `cors`, `bcrypt`, `jsonwebtoken`, `passport`, `passport-google-oauth20`, and `prisma`.

---

### 🧬 Prisma Model

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String?  // Required for email login, optional for Google
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### 🔐 Signup Endpoint

* **Route**: `POST /api/auth/signup`
* **Validations**:

  * `name`: required, min 2 chars
  * `email`: required, valid email format
  * `password`: required, min 6 characters
* **Logic**:

  1. Check if email exists. If yes → return `409 Conflict`.
  2. Hash password using `bcrypt`.
  3. Save new user in DB.
  4. Generate JWT, store in HTTP-only cookie.
  5. Respond with `200 OK` and redirect to `/dashboard`.

---

### 🔑 Login Endpoint (Email/Password)

* **Route**: `POST /api/auth/login`
* **Validations**:

  * `email`: required, valid
  * `password`: required
* **Logic**:

  1. Find user by email.
  2. If not found → `401 Unauthorized`.
  3. Compare hashed password with `bcrypt.compare()`.
  4. On match → Generate JWT and set in cookie.
  5. On fail → `401 Unauthorized`.

---

### 🌐 Google OAuth Login (Passport.js)

* **Routes**:

  * `GET /api/auth/google`
  * `GET /api/auth/google/callback`
* **Logic**:

  1. Initiate Google login with Passport.
  2. On callback:

     * If user exists → login
     * If not → create user (no password)
  3. Generate JWT, set in cookie.
  4. Redirect to `/dashboard`.

---

### 🔎 Auth Middleware

* Create `auth.middleware.ts` to:

  * Check for JWT in `req.cookies.token`
  * Decode it and attach user data to `req.user`
  * Reject unauthorized requests

---

### 🔒 Protected Route

* **Route**: `GET /api/me`
* Uses auth middleware
* Returns current user info based on decoded JWT

---

### 🚪 Logout Endpoint

* **Route**: `POST /api/auth/logout`
* Clears the HTTP-only cookie

---

### 🧠 .env Sample

```
PORT=8000
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
JWT_SECRET=supersecretkey
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
FRONTEND_URL=http://localhost:3000
```

---

## 💻 FRONTEND INSTRUCTIONS (Next.js + ShadCN + Axios)

### ⚙️ Setup

1. Use Next.js App Router (TS)
2. Install ShadCN UI
3. Run:

```bash
npx shadcn@latest add login-03
npx shadcn@latest add dashboard-01
```

---

### 📄 Pages

#### `/login` Page

* Use `login-03` component
* Show:

  * Email/password fields
  * "Continue with Google" button → `/api/auth/google`
* On submit:

  * Call `POST /api/auth/login`
  * On success, redirect to `/dashboard`

#### `/signup` Page

* Similar to `/login`
* Fields: `name`, `email`, `password`
* Call `POST /api/auth/signup`
* On success, redirect to `/dashboard`

#### `/dashboard` Page

* Use `dashboard-01`
* On load, call `GET /api/me` using Axios (`withCredentials: true`)
* Show personalized stats/info

---

### 🔐 Auth Handling

* Use `getServerSideProps` or middleware to block unauthenticated users from accessing `/dashboard`
* Store no token in localStorage — only use HTTP-only cookies

---

### 🌐 Axios Configuration

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api',
  withCredentials: true,
});
```

---

### ✅ Final Notes

* Enforce strict validations on both frontend and backend
* Use HTTPS in production for cookie security
* Make sure CORS is configured with `credentials: true`
* Login with either method should redirect to the same dashboard

---