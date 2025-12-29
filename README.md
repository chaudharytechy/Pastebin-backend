Pastebin-Lite

A lightweight Pastebin-like application that allows users to create text pastes and share a link to view them.
Pastes can optionally expire based on time (TTL) or a maximum number of views.

This project is built as part of a take-home assignment and is designed to pass automated tests.

Features

Create a paste with arbitrary text

Generate a shareable URL

View paste content via browser

Optional constraints:

Time-to-live (TTL)

Maximum view count

Paste becomes unavailable when any constraint is triggered

Deterministic time handling for testing

Persistent storage (MongoDB)


├── backend/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── package.json


1-Health Check

GET /api/healthz

Response:

{ "ok": true }


2-POST /api/pastes

{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}


3-GET /api/pastes/:id
{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}


View a Paste (HTML)
GET   fronted base url/p/:id
Returns an HTML page containing the paste content

Returns HTTP 404 if the paste is unavailable

Content is rendered safely (no script execution)


RUN- npm run dev or npm run start 