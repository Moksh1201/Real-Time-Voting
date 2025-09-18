# Move37 Ventures - Real-Time Polling API

Backend service for a real-time polling application using Express, PostgreSQL, Prisma, and Socket.IO.

## Requirements

- Node.js 18+
- PostgreSQL

## Setup

1. Copy `.env.example` to `.env` and set env vars:
   - `DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public`
   - `PORT=3000`
2. Install deps:
```
npm install
```
3. Run migrations and generate client:
```
npx prisma migrate deploy
```
4. Start server:
```
npm run dev
```

## Docker

Build and run (requires a reachable Postgres via `DATABASE_URL`):
```
docker build -t move37-polling .
docker run --name move37-polling --env DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?schema=public -p 3000:3000 move37-polling
```

## API

- Users
  - POST `/api/users` { name, email, password }
  - GET `/api/users`
  - GET `/api/users/:id`
- Polls
  - POST `/api/polls` { question, creatorId, options: string[] }
  - GET `/api/polls`
  - GET `/api/polls/:id`
- Votes
  - POST `/api/votes` { userId, pollOptionId }

## Realtime

- Connect via Socket.IO
- Join a room by poll id: `joinPoll` with payload `pollId`
- Receive updates on `pollUpdate`


