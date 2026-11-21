# TaskBoard — Backend

Express.js REST API with MongoDB for the Mini Project Manager application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JSON Web Tokens (jsonwebtoken) + bcryptjs
- **Dev**: nodemon

## Prerequisites

- Node.js 18+
- MongoDB running locally on port 27017 (or a MongoDB Atlas URI)

## Setup

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Create your `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mini-project-manager
   JWT_SECRET=supersecretjwtkey123456789
   JWT_EXPIRE=7d
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Or start production server:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Projects
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | List all projects | Yes |
| POST | `/api/projects` | Create a project | Yes |
| GET | `/api/projects/:id` | Get a single project | Yes |
| PUT | `/api/projects/:id` | Update a project | Yes |
| DELETE | `/api/projects/:id` | Delete a project + tasks | Yes |

### Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks/:projectId/tasks` | List tasks for a project | Yes |
| POST | `/api/tasks/:projectId/tasks` | Create a task | Yes |
| PUT | `/api/tasks/:projectId/tasks/:taskId` | Update a task | Yes |
| DELETE | `/api/tasks/:projectId/tasks/:taskId` | Delete a task | Yes |

## Project Structure

```
src/
├── server.js              # App entry point
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
    └── auth.js            # JWT protect middleware
```
