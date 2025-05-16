# TaskBoard Pro

A modern task management application built with React, TypeScript, and Firebase, featuring a Kanban-style board interface for efficient project and task management.

## Features

### Authentication
- Google Sign-in integration
- Email/Password authentication
- Protected routes for authenticated users
- Secure token-based API authentication

### Project Management
- Create and manage multiple projects
- Project details view with description and status
- Add/remove project members
- Project status tracking (active, completed, due-soon)

### Task Management
- Kanban board interface with drag-and-drop functionality
- Task status columns (To Do, In Progress, Review, Completed)
- Task creation with title, description, due date, and priority
- Task editing and deletion
- Task comments system

### User Interface
- Modern, responsive design with Tailwind CSS
- Intuitive drag-and-drop interactions using @dnd-kit
- Loading states and error handling
- Mobile-friendly layout

## Tech Stack

### Frontend
- React 18.3
- TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Zustand (State Management)
- React Router DOM
- date-fns
- @dnd-kit (Drag and Drop)
- Lucide React (Icons)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Firebase Admin SDK
- Express Validator
- CORS enabled

## Project Structure
├── src/
│   ├── components/
│   │   ├── auth/         # Authentication components
│   │   ├── layout/       # Layout components
│   │   └── project/      # Project-related components
│   ├── firebase/         # Firebase configuration
│   ├── pages/            # Route pages
│   ├── services/         # API services
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── server/               # Backend server code
└── public/               # Static assets


## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/taskboard-pro.git
   cd taskboard-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ..
   ```

3. **Set up environment variables**

   Create a `.env` file in the root and in the `server/` directory with the following:

   **Frontend `.env`:**
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=your_backend_url
   ```

   **Backend `server/.env`:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

4. **Start the development servers**

   ```bash
   # Frontend
   npm run dev

   # Backend
   cd server && npm run dev
   ```

---

Feel free to update the repository URL and environment variable values as needed.