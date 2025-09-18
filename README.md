# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a full-stack project management application called "TaskHub" with separate frontend and backend services. The application enables users to manage workspaces, projects, and tasks with role-based access control.

## Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js with ES modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with bcrypt for password hashing
- **Security**: Arcjet integration for protection
- **Email**: SendGrid for email notifications
- **Structure**: MVC pattern with controllers, models, routes, and middleware

Key architectural components:
- **Controllers**: Handle business logic (`/controllers/`)
- **Models**: Mongoose schemas for data modeling (`/models/`)
- **Routes**: API endpoint definitions (`/routes/`)
- **Middleware**: Auth middleware and validation (`/middleware/`, `/libs/`)

### Frontend (React Router v7)
- **Framework**: React Router v7 with server-side rendering
- **Styling**: TailwindCSS v4 with Radix UI components
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with TypeScript

Key architectural patterns:
- **Route-based structure**: File-based routing with layouts (`/app/routes/`)
- **Custom hooks**: Encapsulated API interactions (`/app/hooks/`)
- **Context providers**: Auth and React Query providers (`/app/provider/`)
- **Type safety**: Comprehensive TypeScript interfaces (`/app/types/`)

## Development Commands

### Backend Development
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server with nodemon
npm run dev

# Start production server
npm start
```

### Frontend Development
```bash
# Navigate to frontend directory  
cd frontend

# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck
```

### Running Both Services
Backend runs on port 5000 (or PORT env var), Frontend runs on port 5173 (dev) or 3000 (production).

## Docker Support

The frontend includes Docker support for containerized deployment:

```bash
# Build Docker image (from frontend directory)
docker build -t project-manager-frontend .

# Run container
docker run -p 3000:3000 project-manager-frontend
```

## Key Data Models

The application revolves around these core entities:
- **User**: Authentication and profile management
- **Workspace**: Top-level organizational unit with members and roles
- **Project**: Contains tasks, has status tracking and members
- **Task**: Individual work items with priorities, assignees, and subtasks
- **Activity**: Audit trail of user actions across resources

## API Structure

Backend API is organized under `/api-v1/` with these main routes:
- `/auth` - Authentication (sign in/up, password reset, email verification)
- `/workspaces` - Workspace CRUD and member management  
- `/projects` - Project management within workspaces
- `/tasks` - Task CRUD with assignments and status updates
- `/users` - User profile management

## Authentication Flow

The app uses JWT-based authentication:
1. User signs up → email verification required
2. Sign in → JWT token issued
3. Protected routes require valid JWT in Authorization header
4. Frontend stores auth state in context with React Query

## Environment Setup

### Backend Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret  
- `FRONTEND_URL` - CORS allowed origin
- `SENDGRID_API_KEY` - Email service API key
- `PORT` - Server port (default: 5000)

### Frontend Environment Variables
- API endpoints configuration in `.env`

## Development Patterns

### Frontend Patterns
- **Route Components**: Each route is a separate component with co-located types
- **Custom Hooks**: API calls abstracted into reusable hooks (`use-auth.ts`, `use-project.ts`, etc.)
- **Form Validation**: Zod schemas in `/lib/schema.ts` with React Hook Form
- **Error Boundaries**: Global error handling in root layout
- **Loading States**: Consistent loading components and patterns

### Backend Patterns  
- **Controller-Route Separation**: Routes handle HTTP concerns, controllers handle business logic
- **Middleware Chain**: Auth middleware → validation middleware → controller
- **Error Handling**: Global error middleware with proper HTTP status codes
- **Schema Validation**: Zod schemas with custom validation middleware

## Testing Strategy

Currently no test setup is configured. Consider adding:
- Backend: Jest/Mocha for API testing
- Frontend: Vitest for unit tests, Playwright for E2E

## Workspace-Based Architecture

The application uses a hierarchical structure: **Workspace** → **Project** → **Task**, where:
- Users can be members of multiple workspaces with different roles
- Projects belong to workspaces and inherit access control
- Tasks belong to projects and can be assigned to workspace members
- Activity logging tracks changes across all levels
