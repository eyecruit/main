
## 🎯 Goal

Build a secure and scalable authentication system using:

* Node.js with TypeScript
* Express.js
* Prisma ORM (PostgreSQL)
* Google OAuth
* bcrypt for password hashing
* JWT (stored in HTTP-only cookies)

Users should be able to:

* Sign up with **name, email, and password**
* Log in with either **email/password** or **Google login**
* Be redirected to `/dashboard` upon successful login
* Have email uniqueness enforced and validations applied

---

## 🏗️ Tech Stack

| Layer    | Tool                        |
| -------- | --------------------------- |
| Language | TypeScript                  |
| Server   | Node.js + Express           |
| ORM      | Prisma                      |
| Database | PostgreSQL                  |
| Auth     | JWT + HTTP-only cookies     |
| OAuth    | Google (Passport.js)        |
| Hashing  | bcrypt                      |
| Utils    | dotenv, cors, cookie-parser |

---

## 🔐 Signup Flow

**Endpoint**: `POST /api/auth/signup`

### ✅ Input (Request Body)

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### 🔍 Validations

* `name`: required, min 2 chars
* `email`: required, valid format
* `password`: required, min 6 chars

### 🔁 Process

1. Check if the email already exists in DB.
2. If it does → return `409 Conflict`.
3. Hash the password using `bcrypt`.
4. Create user in PostgreSQL via Prisma.
5. Generate JWT and store in HTTP-only cookie.
6. Return user info and redirect to `/dashboard`.

---

## 🔐 Login Flow

**Endpoint**: `POST /api/auth/login`

### ✅ Input

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### 🔍 Validations

* `email`: required, valid format
* `password`: required

### 🔁 Process

1. Find user by email.
2. If not found → return `401 Unauthorized`.
3. Compare password with hashed version using `bcrypt.compare`.
4. If valid → generate JWT, store in cookie, return user.
5. Else → return `401 Unauthorized`.

---

## 🔑 Google Login Flow

**Routes**:

* `GET /api/auth/google` → Initiates login via Passport.js
* `GET /api/auth/google/callback` → Handles callback from Google

### 🔁 Process

1. Redirect user to Google OAuth screen.
2. On callback, get user's email and name.
3. If user exists → log in.
4. If not → create user (no password).
5. Generate JWT, store in cookie.
6. Redirect to `/dashboard`.

---

## 🧬 Prisma Model (`schema.prisma`)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String?  // Optional for Google users
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🧠 Environment Variables (`.env`)

```
PORT=8000
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
JWT_SECRET=supersecretkey
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
FRONTEND_URL=http://localhost:3000
```

---

---

## ✅ Requirements Summary

* 🧠 Email must be unique.
* ✅ Passwords must be hashed (bcrypt).
* ⚠️ Validations must be strict.
* 🔐 JWT stored in **HTTP-only**, secure cookies.
* 🎯 Google login and manual login should work interchangeably.
* 🌐 CORS must allow credentials (`credentials: true`).

---