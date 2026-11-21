# TaskBoard — Frontend

Next.js 14 frontend for the Mini Project Manager.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + React Redux
- **HTTP Client**: Axios

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:3000`. Needs the backend running at `http://localhost:5000`.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Redirects to dashboard or login |
| `/login` | Login |
| `/signup` | Register |
| `/dashboard` | Overview with stats |
| `/dashboard/projects` | Projects list with search |
| `/dashboard/projects/[id]` | Kanban board for a project |
| `/dashboard/tasks` | All tasks table |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── projects/page.tsx
│       ├── projects/[id]/page.tsx
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

## Features

- JWT auth with protected routes
- Project cards with progress bars
- Kanban board with inline status updates
- Overdue task highlighting
- Filter by status and due date
- Create / edit / delete tasks and projects
- All-tasks table across all projects
- Sidebar with active route highlighting
