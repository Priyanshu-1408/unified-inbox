# Unified Inbox

A production-oriented monorepo foundation for a unified messaging inbox, using React, Vite, Tailwind CSS, Express, MongoDB/Mongoose, Socket.IO, and OpenAI. The structure keeps channel integrations and AI capabilities modular as the application grows.

## Requirements

- Node.js 20 or newer and npm
- MongoDB for backend runtime features when they are added

## Setup

1. Copy `frontend/.env.example` to `frontend/.env.local` and `backend/.env.example` to `backend/.env`, then fill in local values as needed. Do not commit environment files.
2. Install workspace dependencies from the repository root:

   ```sh
   npm install
   ```

3. Start both development processes:

   ```sh
   npm run dev
   ```

   Or run just one process with `npm run dev:frontend` or `npm run dev:backend`.

The Vite development server uses port 5173 by default. The Express placeholder uses `PORT` (default 3000). The frontend currently provides only a minimal app shell; product UI, APIs, authentication, persistence, and messaging behavior are intentionally not implemented.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run frontend and backend in parallel |
| `npm run dev:frontend` | Run the Vite development server |
| `npm run dev:backend` | Run the Express development server |
| `npm run build` | Build the frontend |
| `npm start` | Start the backend entry point |

## Structure

```text
.
├── frontend/                   # React + Vite client
│   └── src/
│       ├── app/                 # App composition and providers
│       ├── assets/              # Client-owned static assets
│       ├── components/          # Shared UI components
│       ├── features/            # Feature modules (auth, inbox, team, ...)
│       ├── hooks/               # Shared React hooks
│       ├── layouts/             # Shared page layouts
│       ├── pages/               # Route-level pages
│       ├── routes/              # Route definitions
│       ├── services/            # API and external service clients
│       ├── styles/              # Global styles and Tailwind entry
│       └── utils/               # Shared client utilities
└── backend/                    # Express + Socket.IO server
    └── src/
        ├── config/              # Environment and infrastructure setup
        ├── modules/             # Domain modules (auth, inbox, integrations, ...)
        ├── middleware/          # Cross-cutting Express middleware
        ├── sockets/             # Socket.IO setup and event registration
        ├── utils/               # Shared server utilities
        └── app.js               # Express app and HTTP server entry point
```

### Frontend feature modules

Place feature-specific UI, hooks, and services together under `frontend/src/features/`. Keep reusable components and shared infrastructure in their corresponding top-level `src` directories. Start with `auth`, `inbox`, `contacts`, `team`, and `integrations` when those features are introduced.

### Backend modules

Each domain under `backend/src/modules/` can own its routes, controller, service, model, and validators. Integrations live under `integrations/providers/`, with one directory per provider (`whatsapp`, `instagram`, `facebook-messenger`, `gmail`, `telegram`). Shared integration contracts and orchestration belong at the integrations module level. AI capabilities live independently under `ai/` so replies, summaries, and automation can evolve separately.
