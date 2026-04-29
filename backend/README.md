# Backend Auth (JavaScript)

This backend implements user authentication in JavaScript/Node.js, based on the project requirements described in the PDF deliveries:
- Register with secure password hashing (`bcrypt` + salt rounds)
- Login with credential verification and JWT token generation
- Basic role-aware protection middleware
- Rate limiting on login endpoint

## Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /api/me`
- `GET /api/admin-only`

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Create DB schema:
   - Run `schema.sql` in your MySQL database.
3. Install dependencies:
   - `npm install`
4. Start server:
   - `npm run dev`
