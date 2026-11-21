# TaskBoard — Mini Project Manager

A full-stack project and task management application built with Express.js and Next.js.

## Overview

TaskBoard lets you create projects, organize tasks into a Kanban board (To Do / In Progress / Done), filter by status and due date, and track overall progress — all behind a clean, modern UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14 (App Router) |
| Frontend Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Redux Toolkit + React Redux |
| HTTP Client | Axios |
| Backend Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Dev Server | nodemon |

## Folder Structure

```
web-plant-assesment/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   └── tasks.js
│   │   └── middleware/
│   │       └── auth.js
│   ├── .env
│   ├── .env.example
│   └── package.json
└── frontend/
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── login/page.tsx
        │   ├── signup/page.tsx
        │   └── dashboard/
        │       ├── layout.tsx
        │       ├── page.tsx
        │       ├── projects/
        │       │   ├── page.tsx
        │       │   └── [id]/page.tsx
        │       └── tasks/page.tsx
        ├── components/
        │   ├── Providers.tsx
        │   └── Sidebar.tsx
        ├── store/
        │   ├── index.ts
        │   ├── authSlice.ts
        │   ├── projectSlice.ts
        │   ├── taskSlice.ts
        │   └── hooks.ts
        └── lib/
            └── api.ts
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas connection string

### 2. Backend Setup

```bash
cd backend

# Dependencies are already installed
# Create .env from example:
cp .env.example .env

# Edit .env if needed, then start:
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend

# Dependencies are already installed
npm run dev
```

The app runs at `http://localhost:3000`.

## Environment Variables

Create `backend/.env` with the following (see `.env.example`):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mini-project-manager
JWT_SECRET=supersecretjwtkey123456789
JWT_EXPIRE=7d
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get authenticated user |

### Projects (all require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List user's projects (with task counts) |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get a single project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete project + all its tasks |

### Tasks (all require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/:projectId/tasks` | List tasks (supports `?status=` and `?dueDate=` filters) |
| POST | `/api/tasks/:projectId/tasks` | Create a task |
| PUT | `/api/tasks/:projectId/tasks/:taskId` | Update a task |
| DELETE | `/api/tasks/:projectId/tasks/:taskId` | Delete a task |

## Features

- **Authentication** — Register / login with JWT stored in localStorage
- **Projects** — Create, list, search, delete projects with task progress bars
- **Kanban Board** — Three-column board (To Do, In Progress, Done) per project
- **Task Management** — Create, edit, delete tasks with title, description, status, due date
- **Inline Status Updates** — Change task status directly from the Kanban card
- **Filtering** — Filter tasks by status and due date
- **Overdue Indicators** — Past-due tasks highlighted in red
- **All Tasks View** — Table view of every task across all projects
- **Dashboard Stats** — Total projects, total tasks, completed tasks at a glance
- **Responsive Sidebar** — Sticky sidebar with active route highlighting and user info
