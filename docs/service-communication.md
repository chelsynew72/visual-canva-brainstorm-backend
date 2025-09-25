Service communication reference

This file documents common gateway endpoints and message patterns and gives quick curl examples for authenticated requests.

Gateway REST (proxy) endpoints
- POST /auth/login -> forwards to auth service (pattern: auth.login)
- POST /auth/register -> forwards to auth service (pattern: auth.register)
- POST /auth/logout -> guarded, forwards to auth.logout
- GET /api/users/me -> guarded, returns current user profile via auth/user service
- GET /api/rooms -> forwards to rooms.findAll
- POST /api/rooms -> forwards to rooms.create

Common RabbitMQ message patterns
- auth.login -> payload { email, password } -> returns { user, token }
- auth.register -> payload { ...signup } -> returns { user, token }
- auth.verify -> payload { token } -> returns { valid, payload }
- rooms.create, rooms.findAll, rooms.findOne, rooms.join, rooms.leave
- canvas.create, canvas.save, canvas.get, canvas.update

Quick curl examples

1) Login via gateway (get token)

curl -i -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword"}'

Response body typically contains a token in one of these fields: access_token, token, accessToken. Save it.

2) Use token to call protected endpoint

curl -i -X GET http://localhost:3002/api/users/me \
  -H "Authorization: Bearer <JWT_HERE>"

If you get 401, ensure the token was issued by the auth service and gateway and auth service share the same JWT secret.

Notes
- Gateway validates JWT using JwtAuthGuard and forwards userId as needed to downstream services.
- If your frontend stores the token in localStorage under the key `token`, you can copy it and use it in the curl examples above.
