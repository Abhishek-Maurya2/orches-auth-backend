# Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT APPLICATIONS                              │
│                   (Mobile - Expo/React Native, Web)                     │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS Requests
                              │ (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY LAYER                               │
│                         (Express.js Server)                              │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Security Middleware                           │   │
│  │  • Helmet (HTTP Security Headers)                               │   │
│  │  • CORS (Cross-Origin Resource Sharing)                         │   │
│  │  • Body Parser (JSON, limit: 5mb)                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                   Request Pipeline                               │   │
│  │                                                                   │   │
│  │  1. Validation Middleware (express-validator)                   │   │
│  │  2. Authentication Middleware (JWT verification)                │   │
│  │  3. Route Controllers                                            │   │
│  │  4. Error Handling Middleware                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        ROUTING LAYER                                     │
│                      /api/v1/auth/*                                      │
│                                                                           │
│  POST   /register          → Register new user                          │
│  POST   /login             → Authenticate user                           │
│  POST   /logout            → Invalidate refresh token                    │
│  POST   /refresh-tokens    → Get new access/refresh tokens              │
│  GET    /me                → Get current user profile (protected)        │
│  PUT    /me                → Update user profile (protected)             │
│  POST   /password/forgot   → Request password reset OTP                  │
│  POST   /password/reset    → Reset password with OTP                     │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       CONTROLLER LAYER                                   │
│                    (auth.controller.js)                                  │
│                                                                           │
│  • Handles HTTP request/response                                        │
│  • Delegates business logic to services                                 │
│  • Returns standardized JSON responses                                  │
│  • Passes errors to error middleware                                    │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                                     │
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │  auth.service    │  │  token.service   │  │  user.service    │     │
│  │                  │  │                  │  │                  │     │
│  │ • register()     │  │ • generateAccess │  │ • createUser()   │     │
│  │ • login()        │  │ • generateRefresh│  │ • findByEmail()  │     │
│  │ • refresh()      │  │ • verifyAccess   │  │ • findByPhone()  │     │
│  │ • logout()       │  │ • verifyRefresh  │  │ • findById()     │     │
│  │ • resetPassword()│  │                  │  │ • updateProfile()│     │
│  │ • updateProfile()│  └──────────────────┘  │ • updatePassword│     │
│  └──────────────────┘                        │ • comparePassword│     │
│                                               └──────────────────┘     │
│  ┌──────────────────┐                                                   │
│  │  otp.service     │                                                   │
│  │                  │                                                   │
│  │ • assignAndSend  │                                                   │
│  │ • generateOtp()  │                                                   │
│  │ • sendEmail()    │                                                   │
│  └──────────────────┘                                                   │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                       │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    MongoDB/Mongoose                              │   │
│  │                                                                   │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │               User Collection Schema                      │  │   │
│  │  │                                                            │  │   │
│  │  │  • _id (ObjectId)                                         │  │   │
│  │  │  • name (String)                                          │  │   │
│  │  │  • email (String, unique, indexed)                       │  │   │
│  │  │  • phone (String, unique, indexed)                       │  │   │
│  │  │  • profilePhoto (String, base64)                         │  │   │
│  │  │  • passwordHash (String, bcrypt)                         │  │   │
│  │  │  • resetOtp (String, nullable)                           │  │   │
│  │  │  • resetOtpExpires (Date, nullable)                      │  │   │
│  │  │  • createdAt (Date)                                       │  │   │
│  │  │  • updatedAt (Date)                                       │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘


## Authentication Flow

### Registration Flow
┌─────────┐       ┌──────────┐      ┌─────────┐      ┌──────────┐
│ Client  │──1──>│ Validate │──2──>│ Hash    │──3──>│  Save    │
│         │      │  Input   │      │Password │      │  User    │
└─────────┘      └──────────┘      └─────────┘      └──────────┘
     ▲                                                      │
     │                                                      4
     │           ┌──────────────────────────────────────────┘
     │           │
     │           ▼
     │      ┌──────────┐
     └──5───│ Generate │
            │  Tokens  │
            │(JWT A+R) │
            └──────────┘

### Login Flow
┌─────────┐       ┌──────────┐      ┌─────────┐      ┌──────────┐
│ Client  │──1──>│ Find     │──2──>│ Compare │──3──>│ Generate │
│         │      │  User    │      │Password │      │  Tokens  │
└─────────┘      └──────────┘      └─────────┘      └──────────┘
     ▲                                                      │
     └──────────────────────4───────────────────────────────┘

### Token Refresh Flow
┌─────────┐       ┌──────────┐      ┌─────────┐      ┌──────────┐
│ Client  │──1──>│ Verify   │──2──>│ Extract │──3──>│ Generate │
│         │      │ Refresh  │      │ User ID │      │New Tokens│
└─────────┘      │  Token   │      └─────────┘      └──────────┘
     ▲           └──────────┘                              │
     └────────────────────4──────────────────────────────┘

### Password Reset Flow
┌─────────┐       ┌──────────┐      ┌─────────┐      ┌──────────┐
│ Client  │──1──>│ Request  │──2──>│Generate │──3──>│  Email   │
│         │      │  Reset   │      │6-Digit  │      │   OTP    │
└─────────┘      └──────────┘      │  OTP    │      └──────────┘
     │                              └─────────┘
     │                                   │
     │                                   4 (Store OTP + Expiry)
     │                                   ▼
     │                              ┌──────────┐
     │──────5 (Provide OTP)──────>│ Verify   │
     │                              │  OTP +   │
     │                              │  Update  │
     │                              │ Password │
     │                              └──────────┘
     │                                   │
     └────────6 (Success Response)───────┘


## Security Features

┌─────────────────────────────────────────────────────────────────────────┐
│                          SECURITY LAYERS                                 │
│                                                                           │
│  1. Input Validation                                                     │
│     • express-validator schemas                                          │
│     • Email format, phone presence, password length                      │
│     • Base64 pattern matching for profile photos                         │
│                                                                           │
│  2. Password Security                                                    │
│     • bcrypt hashing (salt rounds: 10)                                   │
│     • Minimum 8 characters                                               │
│     • Never stored in plaintext                                          │
│                                                                           │
│  3. JWT Authentication                                                   │
│     • Access Token: 15 minutes expiry                                    │
│     • Refresh Token: 30 days expiry                                      │
│     • HS256 algorithm                                                    │
│     • Payload: { sub: userId, iat, exp }                                │
│                                                                           │
│  4. OTP Security                                                         │
│     • 6-digit numeric code                                               │
│     • 15-minute expiration                                               │
│     • Single-use (cleared after successful reset)                        │
│     • Delivered via email (Nodemailer/SMTP)                              │
│                                                                           │
│  5. HTTP Security                                                        │
│     • Helmet middleware (security headers)                               │
│     • CORS with credentials support                                      │
│     • 5MB JSON body limit                                                │
│                                                                           │
│  6. Error Handling                                                       │
│     • Centralized ApiError class                                         │
│     • Sanitized error responses                                          │
│     • Stack traces only in development                                   │
│     • Structured logging (Winston)                                       │
└─────────────────────────────────────────────────────────────────────────┘


## Data Flow Example: User Registration

┌────────┐                                                        ┌────────┐
│ Mobile │                                                        │ Server │
│ Client │                                                        │        │
└───┬────┘                                                        └───┬────┘
    │                                                                 │
    │ POST /api/v1/auth/register                                     │
    │ {                                                               │
    │   "name": "Jane Doe",                                          │
    │   "email": "jane@example.com",                                 │
    │   "phone": "+1555010",                                         │
    │   "password": "SecurePass123",                                 │
    │   "profilePhoto": "base64string..."                            │
    │ }                                                               │
    ├────────────────────────────────────────────────────────────────>│
    │                                                                 │
    │                                        [1] Validate Input       │
    │                                        └─ express-validator     │
    │                                                                 │
    │                                        [2] Check Email Unique   │
    │                                        └─ user.service          │
    │                                                                 │
    │                                        [3] Check Phone Unique   │
    │                                        └─ user.service          │
    │                                                                 │
    │                                        [4] Hash Password        │
    │                                        └─ bcrypt.hash()         │
    │                                                                 │
    │                                        [5] Create User Record   │
    │                                        └─ User.create()         │
    │                                                                 │
    │                                        [6] Generate JWT Tokens  │
    │                                        └─ token.service         │
    │                                                                 │
    │                                        [7] Sanitize Response    │
    │                                        └─ user.toJSON()         │
    │                                                                 │
    │ 201 Created                                                     │
    │ {                                                               │
    │   "data": {                                                     │
    │     "id": "507f1f77bcf86cd799439011",                          │
    │     "name": "Jane Doe",                                         │
    │     "email": "jane@example.com",                               │
    │     "phone": "+1555010",                                       │
    │     "profilePhoto": "base64string...",                         │
    │     "createdAt": "2025-10-28T10:00:00.000Z",                  │
    │     "updatedAt": "2025-10-28T10:00:00.000Z"                   │
    │   },                                                            │
    │   "tokens": {                                                   │
    │     "accessToken": "eyJhbGci...",                              │
    │     "refreshToken": "eyJhbGci...",                             │
    │     "expiresIn": 900                                            │
    │   }                                                             │
    │ }                                                               │
    │<────────────────────────────────────────────────────────────────│
    │                                                                 │
    │ [Store tokens in AsyncStorage]                                 │
    │ [Navigate to /(app)/home]                                      │
    │                                                                 │
