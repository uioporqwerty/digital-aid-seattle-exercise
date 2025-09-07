# Digital Aid Seattle - Donation Management System

A full-stack web application for managing donations at a local shelter. Built with Next.js (frontend) and Fastify (backend) with TypeScript.

## Project Overview

This application provides a user-friendly interface for shelter staff to:

- Record new donations with detailed information
- View and search through donation history
- Edit existing donation records
- Delete donation entries
- Track donation statistics

## Architecture

### Frontend (Next.js + MUI)

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Styling**: MUI theme + Emotion
- **Date Handling**: Day.js with MUI Date Pickers

### Backend (Fastify + TypeScript)

- **Framework**: Fastify with TypeBox validation
- **Language**: TypeScript
- **Data Storage**: In-memory (for simplicity)
- **API Style**: REST with full CRUD operations
- **CORS**: Configured for frontend integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd digital-aid-seattle
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Backend will start at: http://localhost:3001

3. **Frontend Setup (in a new terminal)**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Frontend will start at: http://localhost:3000

4. **Access the Application**
   - Open your browser to http://localhost:3000
   - The backend API is available at http://localhost:3001

## API Endpoints

### Donations

- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get specific donation
- `POST /api/donations` - Create new donation
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation
- `GET /api/donations/stats` - Get donation statistics

### System

- `GET /health` - Health check
- `GET /api` - API information

## Configuration

### Environment Variables

**Backend** (`.env`):

```
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
digital-aid-seattle/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   └── types/           # TypeScript type definitions
│   └── package.json
├── backend/                  # Fastify backend application
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic services
│   │   ├── types/           # TypeScript type definitions
│   │   └── index.ts         # Server entry point
│   └── package.json
└── README.md
```

## Technical Decisions

1. **In-Memory Storage**: Chosen for simplicity as requested. In production, this would be replaced with a database (PostgreSQL, MongoDB, etc.).

2. **TypeScript**: Used throughout for type safety and better developer experience.

3. **MUI Components**: Provides professional, accessible UI components out of the box.

4. **Fastify**: Chosen for its performance, TypeScript support, and built-in validation.

5. **Component Architecture**: Frontend follows React best practices with separation of concerns.

## Notes

This implementation focuses on core functionality and clean architecture. The in-memory storage makes the application stateless - data resets when the server restarts. For production use, integrate with a proper database system.

The application demonstrates full-stack TypeScript development with modern frameworks and follows best practices for both frontend and backend development.
