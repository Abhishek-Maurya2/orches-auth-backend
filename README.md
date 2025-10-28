# Authentication Microservice

Node.js authentication microservice that provides JWT-based authentication, user registration, login, and password reset using email-delivered one-time passcodes (OTP). Designed for consumption by mobile (React Native/Expo) and web clients.

## Features

- User registration capturing name, email, phone, profile photo (base64 string), and password
- Secure password storage with bcrypt
- JWT access and refresh tokens
- Login and token refresh endpoints
- Password reset flow with OTP delivered via email using Nodemailer
- Modular architecture (routes, controllers, services, models, config)
- Centralized error handling and validation with express-validator

## Prerequisites

- Node.js 18+
- MongoDB instance
- SMTP credentials for sending OTP emails

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and update the values:

   ```bash
   copy .env.example .env
   ```

3. Start the development server with automatic reload:

   ```bash
   npm run dev
   ```

   The service listens on `http://localhost:3000` by default.

4. Run the linter and tests:

   ```bash
   npm run lint
   npm test
   ```

## API Overview

Base URL: `/api/v1`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate user and return tokens |
| POST | `/auth/refresh` | Exchange refresh token for new tokens |
| POST | `/auth/password/forgot` | Send password reset OTP |
| POST | `/auth/password/reset` | Reset password with OTP |

## Testing

Tests are executed with Jest and Supertest. Add integration tests under `tests/` or unit tests alongside modules in `src/`.

## Project Structure

```
src/
  app.js
  server.js
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  validations/
  utils/
```

## License

ISC
