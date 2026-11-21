# TaskBoard — Frontend

Next.js 14 (App Router) frontend for the Mini Project Manager application.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + React Redux
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:5000`

## Setup

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/dashboard` or `/login` |
| `/login` | Login page |
| `/signup` | Registration page |
| `/dashboard` | Overview with stats and recent projects |
| `/dashboard/projects` | Full projects listing with search |
| `/dashboard/projects/[id]` | Kanban task board for a project |
| `/dashboard/tasks` | All tasks across all projects (table view) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with Redux Provider
│   ├── page.tsx                      # Root redirect
│   ├── globals.css
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── dashboard/
│       ├── layout.tsx                # Auth guard + Sidebar
│       ├── page.tsx                  # Dashboard overview
│       ├── projects/
│       │   ├── page.tsx              # Projects list
│       │   └── [id]/page.tsx         # Kanban board
│       └── tasks/page.tsx            # All tasks table
├── components/
│   ├── Providers.tsx                 # Redux Provider wrapper
│   └── Sidebar.tsx                   # Navigation sidebar
├── store/
│   ├── index.ts
│   ├── authSlice.ts
│   ├── projectSlice.ts
│   ├── taskSlice.ts
│   └── hooks.ts
└── lib/
    └── api.ts                        # Axios instance with auth interceptor
```

## Features

- Split-panel auth pages (form + decorative panel)
- Protected dashboard routes with JWT auth check
- Project cards with progress bars
- Kanban board with To Do / In Progress / Done columns
- Inline task status update via dropdown
- Overdue task highlighting
- Filter tasks by status and due date
- Create / edit / delete tasks and projects via modals
- All-tasks table view across all projects
- Responsive sidebar navigation with active state
