# TaskBoard — Backend

Express.js REST API with MongoDB for the Mini Project Manager.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5000`.

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mini-project-manager
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

## API Endpoints

### Auth
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |

### Projects
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/projects` | Yes |
| POST | `/api/projects` | Yes |
| GET | `/api/projects/:id` | Yes |
| PUT | `/api/projects/:id` | Yes |
| DELETE | `/api/projects/:id` | Yes |

### Tasks
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/tasks/:projectId/tasks` | Yes |
| POST | `/api/tasks/:projectId/tasks` | Yes |
| PUT | `/api/tasks/:projectId/tasks/:taskId` | Yes |
| DELETE | `/api/tasks/:projectId/tasks/:taskId` | Yes |

## Project Structure

```
src/
├── server.js
├── models/
│   ├── User.js
│   ├── Project.js
│   └── Task.js
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   └── taskController.js
├── routes/
│   ├── auth.js
│   ├── projects.js
│   └── tasks.js
└── middleware/
    └── auth.js
```
