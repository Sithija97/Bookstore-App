# Bookstore App API

A Node.js application built with TypeScript and Express.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

# Bookstore App API

Production-ready Node.js + TypeScript + Express API with feature-based modules, MongoDB/Mongoose persistence, and secure access/refresh token rotation.

## Folder Tree

```text
src/
  app.ts
  index.ts
  common/
    config/
    db/
    errors/
    middleware/
    types/
    utils/
  features/
    auth/
      controller/
      model/
      repository/
      router/
      schemas/
      service/
      tests/
      types/
    users/
      controller/
      model/
      repository/
      router/
      schemas/
      service/
      types/
```

## Stack

- Node.js, TypeScript, Express
- MongoDB + Mongoose
- Zod validation
- JWT access and refresh tokens
- bcryptjs password hashing
- dotenv config loading
- httpOnly refresh cookies with CSRF protection

## Security Decisions

- Refresh tokens are one-time-use and hashed in storage; the plaintext token is never persisted.
- Every refresh creates a new token in the same family, and the previous token is marked `rotated`.
- Reuse of an invalidated refresh token is treated as a compromise signal and revokes the family or all sessions based on `REFRESH_REUSE_REVOKE_SCOPE`.
- Access tokens are short-lived, and `tokenVersion` is used to invalidate them during logout-all or reuse handling.
- Cookie mode uses a double-submit CSRF token: a readable CSRF cookie plus an `x-csrf-token` header/body value match.
- Login and refresh are rate-limited, and repeated login failures trigger temporary account lockout.

## Environment

Copy [`.env.example`](.env.example) to `.env` and fill in the secrets.

## Scripts

- `npm run dev` - start in development
- `npm run build` - compile TypeScript
- `npm start` - run the compiled app
- `npm run typecheck` - run TypeScript without emit
- `npm test` - run the integration tests

## API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/logout-all`
- `GET /auth/me`

## Flow

### Login

1. Client posts credentials to `/auth/login`.
2. Server validates input, checks password, and resets the user login lock state.
3. Server issues an access token and refresh token.
4. Server stores a hashed refresh token record with a fresh `familyId`.
5. Server sets the refresh token in an httpOnly cookie and returns the access token in the response body.

### Refresh Rotation

1. Client sends the refresh token from cookie or body plus the CSRF value.
2. Server verifies JWT signature and claims.
3. Server hashes the incoming refresh token and looks it up in MongoDB.
4. If the token is active, it is marked `rotated` and a new refresh token is created in the same family.
5. The new refresh token replaces the old cookie value.

### Reuse Detection

1. An already rotated or revoked refresh token is presented again.
2. Server treats this as reuse and marks the token `reused`.
3. The configured scope is revoked: the whole family or all user sessions.
4. `tokenVersion` is bumped when all sessions must be invalidated.
5. The client must reauthenticate.

## Curl Examples

### Register

```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"reader@example.com","password":"Password123!","name":"Reader"}'
```

### Login

```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"reader@example.com","password":"Password123!"}'
```

### Refresh

```bash
curl -i -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <csrf-token>" \
  -b "refresh_token=<refresh-token>; csrf_token=<csrf-token>" \
  -d '{"refreshToken":"<refresh-token>","csrfToken":"<csrf-token>"}'
```

### Logout

```bash
curl -i -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <csrf-token>" \
  -b "refresh_token=<refresh-token>; csrf_token=<csrf-token>" \
  -d '{"refreshToken":"<refresh-token>","csrfToken":"<csrf-token>"}'
```

### Logout All

```bash
curl -i -X POST http://localhost:3000/auth/logout-all \
  -H "Authorization: Bearer <access-token>" \
  -H "x-csrf-token: <csrf-token>" \
  -b "refresh_token=<refresh-token>; csrf_token=<csrf-token>" \
  -d '{"csrfToken":"<csrf-token>"}'
```

## Sequence Diagram

### Login

1. Client -> `/auth/login`
2. Controller -> service validation
3. Service -> user repository credential lookup
4. Service -> JWT issue + refresh token persistence
5. Response -> access token body + refresh cookie + CSRF cookie

### Refresh Rotation

1. Client -> `/auth/refresh`
2. Middleware -> CSRF check
3. Service -> verify refresh JWT
4. Service -> hash token, load record, confirm `active`
5. Service -> mark old token `rotated`
6. Service -> create new token record in same family
7. Response -> new access token body + rotated refresh cookie

### Reuse Detection

1. Client -> presents reused refresh token
2. Service -> record lookup shows `rotated`/`revoked`
3. Service -> mark token `reused`
4. Service -> revoke family or all sessions
5. Service -> bump `tokenVersion` if configured for full invalidation
6. Response -> 401 and reauthentication required

## Testing

The integration tests cover:

- successful refresh rotation
- reuse detection revoking the family
- logout and logout-all behavior
