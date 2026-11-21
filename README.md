# TaskBoard — Mini Project Manager

A full-stack project and task management app built with Express.js and Next.js.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Redux Toolkit + React Redux |
| HTTP Client | Axios |
| Backend | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

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
        ├── store/
        └── lib/
            └── api.ts
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm run dev
```

Runs at `http://localhost:3000`.

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mini-project-manager
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |

### Projects (Bearer token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get a project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete project and its tasks |

### Tasks (Bearer token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/:projectId/tasks` | List tasks (`?status=` `?dueDate=`) |
| POST | `/api/tasks/:projectId/tasks` | Create a task |
| PUT | `/api/tasks/:projectId/tasks/:taskId` | Update a task |
| DELETE | `/api/tasks/:projectId/tasks/:taskId` | Delete a task |

## Features

- Register / login with JWT stored in localStorage
- Create and manage projects with progress tracking
- Kanban board per project (To Do / In Progress / Done)
- Create, edit, delete tasks with title, description, status and due date
- Change task status inline from the board
- Filter tasks by status and due date
- Overdue tasks highlighted in red
- All tasks view across every project
- Dashboard with project and task counts
