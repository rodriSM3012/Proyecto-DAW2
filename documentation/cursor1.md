Implemented a full JavaScript backend auth module in `backend/`, using the requirements from your PDFs (secure auth, modular structure, role-aware access, rate limiting).

### What I created

- Project setup:
  - `backend/package.json`
  - `backend/.env.example`
  - `backend/README.md`
- Config + DB:
  - `backend/src/config/env.js`
  - `backend/src/database/db.js`
  - `backend/schema.sql` (table `usuario`)
- Auth/business logic:
  - `backend/src/controllers/authController.js`
  - `backend/src/utils/validators.js`
- Security/decorators middleware:
  - `backend/src/middleware/decorators.js`
- Routes:
  - `backend/src/routes/auth.js`
  - `backend/src/routes/api.js`
- App/server bootstrap:
  - `backend/src/app.js`
  - `backend/src/server.js`

### Implemented features (as requested)

- `POST /auth/register`
  - Validates input
  - Hashes password with `bcrypt` (salt rounds)
  - Stores user in MySQL (`usuario`)
  - Returns JWT and sets secure `httpOnly` cookie
- `POST /auth/login`
  - Validates credentials
  - Verifies hash with `bcrypt.compare`
  - Returns JWT and sets cookie
- `POST /auth/logout`
  - Clears auth cookie
- `GET /api/me`
  - Protected endpoint (`authenticateToken`)
- `GET /api/admin-only`
  - Protected + role-guarded (`requireRoles("admin")`)
- Security measures from the PDF guidance:
  - Input sanitization + validation
  - Password hashing
  - JWT auth
  - Rate limiting on login
  - Helmet + CORS + secure cookie handling
  - Modular backend organization (`auth`, `api`, `database`, `decorators`)

### Validation done

- Installed dependencies with `npm install`
- Smoke-tested module load (`node -e "require('./src/app')"`), successful
- Checked lints for `backend/src`, no linter errors reported

### Next step for you

1. Copy `.env.example` to `.env` and set real DB/JWT values.
2. Run `schema.sql` in MySQL.
3. Start backend:
   - `cd backend`
   - `npm run dev`

If you want, I can now add:
- refresh-token flow,
- stricter password/role policies,
- or frontend service functions to consume these endpoints.