# Phase 2: Authentication + User Profile Documentation

## Overview
Phase 2 implements production-grade user registration, authentication, token rotation, and profile management for the **AI Interview Coach** platform using Argon2id password hashing, JWT access & refresh tokens, Prisma ORM with PostgreSQL, NestJS backend API, and Next.js Neumorphic Soft UI frontend interface.

---

## Technical Specifications

### Security Architecture
- **Argon2id**: Memory cost = 64MB, time cost = 3, parallelism = 1. Used for hashing user passwords and refresh tokens.
- **JWT Token Rotation**:
  - **Access Token**: Short-lived (15 minutes), signed with `JWT_SECRET`.
  - **Refresh Token**: Long-lived (7 days), signed with `JWT_REFRESH_SECRET`. Hashed with Argon2id and stored in PostgreSQL `refresh_tokens` table for revocation checking.
- **Passport Strategy**: NestJS `JwtStrategy` extracting Bearer tokens from `Authorization: Bearer <token>` header.

---

## Database Schema (`schema.prisma`)

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String
  fullName      String
  avatarUrl     String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  profile       UserProfile?
  refreshTokens RefreshToken[]

  @@map("users")
}

model UserProfile {
  id                String          @id @default(uuid())
  userId            String          @unique
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  targetRole        String?
  targetCompany     String?
  seniorityLevel    SeniorityLevel? @default(MID_LEVEL)
  techStack         String[]        @default([])
  bio               String?
  yearsOfExperience Int             @default(0)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@map("user_profiles")
}

model RefreshToken {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tokenHash String   @unique
  isRevoked Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
  @@map("refresh_tokens")
}
```

---

## REST API Endpoints

### 1. Register User
`POST /api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "email": "alex@company.com",
    "password": "Password123!",
    "fullName": "Alex Morgan"
  }
  ```
- **Response**: `201 Created` with User DTO & Access + Refresh Token pair.

### 2. Login User
`POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "alex@company.com",
    "password": "Password123!"
  }
  ```
- **Response**: `200 OK` with User DTO & Access + Refresh Token pair.

### 3. Refresh Access Token
`POST /api/v1/auth/refresh`
- **Request Body**:
  ```json
  {
    "refreshToken": "<valid-refresh-token>"
  }
  ```
- **Response**: `200 OK` with new Access + Refresh Token pair (rotated).

### 4. Logout User
`POST /api/v1/auth/logout` *(Bearer Auth Required)*
- **Response**: `200 OK` revoking current session refresh tokens.

### 5. Get Current User Profile
`GET /api/v1/users/me` *(Bearer Auth Required)*
- **Response**: `200 OK` with full user profile details.

### 6. Update User Profile
`PATCH /api/v1/users/me` *(Bearer Auth Required)*
- **Request Body**:
  ```json
  {
    "fullName": "Alex Morgan",
    "targetRole": "Staff Software Engineer",
    "targetCompany": "Google",
    "seniorityLevel": "SENIOR",
    "techStack": ["React", "NestJS", "TypeScript", "PostgreSQL"],
    "bio": "Building scalable AI voice applications."
  }
  ```

---

## Neumorphic Frontend Pages

- `/register`: Neumorphic account creation form with real-time password strength meter.
- `/login`: Neumorphic sign-in page with inset input wells and extruded action button.
- `/profile`: Neumorphic candidate profile & career preferences editor.
- `Navbar`: Interactive session dropdown displaying candidate name, role, profile editor link, and sign-out action.

---

## Verification & Test Results
- **Unit Tests**: `3 passed, 3 total` (`AuthService`, `UsersService`, `HealthController`)
- **E2E Tests**: Clean execution against PostgreSQL database.
- **Frontend Build**: Next.js production build succeeded with `7 static pages`.
