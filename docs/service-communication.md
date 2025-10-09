Service Communication Reference

This file documents common gateway endpoints, message patterns, and provides quick curl examples for authenticated requests.

## Core Services

1. **Authentication Service**
   - Manages user access and room security.
   - Handles login, registration, and token validation.

2. **Real-Time Service**
   - Enables live event broadcasting, such as cursors and chat messages.
   - Supports real-time collaboration features.

3. **Canvas Service**
   - Manages the storage (MongoDB) and history (undo/redo) of the drawing data.
   - Handles canvas creation, updates, and retrieval.

4. **Room Service**
   - Manages session metadata, private rooms, access links, and persistent user/chat logs.
   - Handles room creation, joining, and leaving.

5. **Gateway**
   - Acts as the single entry point for the client application (Next.js).
   - Routes requests like authentication attempts or canvas data updates to the appropriate backend service.
   - Validates JWT tokens and forwards user information to downstream services.

---

## Gateway REST (Proxy) Endpoints

- **POST /auth/login** -> forwards to auth service (pattern: `auth.login`)
- **POST /auth/register** -> forwards to auth service (pattern: `auth.register`)
- **POST /auth/logout** -> guarded, forwards to `auth.logout`
- **GET /api/users/me** -> guarded, returns current user profile via auth/user service
- **GET /api/rooms** -> forwards to `rooms.findAll`
- **POST /api/rooms** -> forwards to `rooms.create`

---

## Common RabbitMQ Message Patterns

- **auth.login** -> payload `{ email, password }` -> returns `{ user, token }`
- **auth.register** -> payload `{ ...signup }` -> returns `{ user, token }`
- **auth.verify** -> payload `{ token }` -> returns `{ valid, payload }`
- **rooms.create**, **rooms.findAll**, **rooms.findOne**, **rooms.join**, **rooms.leave**
- **canvas.create**, **canvas.save**, **canvas.get**, **canvas.update**

---

## Quick Curl Examples

1. **Login via Gateway (Get Token)**

   ```bash
   curl -i -X POST http://localhost:3002/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"you@example.com","password":"yourpassword"}'