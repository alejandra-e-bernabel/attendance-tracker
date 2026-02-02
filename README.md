# Attendance Tracker

A full-stack web application for professors to track student attendance using QR codes.

## Features

- **Class Management**: Create and manage classes with descriptions
- **Student Management**: Add students with First Name, Last Name, Email, and GTID
- **Event Creation**: Create events for classes with automatic QR code generation
- **QR Code Check-In**: Display QR codes for students to scan and check in
- **Attendance Reports**: View attendance statistics and records per class
- **Mobile-Friendly**: Responsive design works on all devices

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- QR Code generation

### Frontend
- React 19 + TypeScript
- React Router for navigation
- HTML5 QR Code Scanner
- Vite for build tooling

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install Backend Dependencies**
```bash
cd attendance-tracker-backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd attendance-tracker-frontend
npm install
```

### Running the Application

1. **Start the Backend Server** (from `attendance-tracker-backend` directory)
```bash
npm run dev
```
The API will be available at `http://localhost:3001`

2. **Start the Frontend** (from `attendance-tracker-frontend` directory)
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

## Usage Guide

### For Professors

1. **Add Students**
   - Go to "Students" page
   - Click "Add Student"
   - Enter student details (First Name, Last Name, Email, GTID)

2. **Create a Class**
   - Go to "Classes" page
   - Click "Add Class"
   - Enter class name and description
   - Add students to the class

3. **Create an Event**
   - Go to "Events" page
   - Click "Create Event"
   - Select a class, name the event, and set the date/time
   - Optionally set QR code expiration time

4. **Display QR Code**
   - Click "View QR" on any event
   - Display the QR code on a projector/screen for students to scan

5. **View Attendance**
   - Go to the Class detail page to see attendance statistics
   - View individual event attendance from the event detail page

### For Students

1. **Check In to Class**
   - Go to "Check In" page
   - Select your name from the dropdown
   - Scan the QR code displayed by the professor OR enter the QR token manually
   - Receive confirmation of successful check-in

## Project Structure

```
attendance-tracker/
├── attendance-tracker-backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── database.ts      # Database setup
│   │   └── server.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
├── attendance-tracker-frontend/
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## API Endpoints

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create a class
- `GET /api/classes/:id` - Get class by ID
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `GET /api/classes/:id/students` - Get students in class
- `POST /api/classes/:id/students/:studentId` - Add student to class
- `DELETE /api/classes/:id/students/:studentId` - Remove student from class

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create a student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create an event
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/class/:classId` - Get events by class
- `GET /api/events/:id/qr` - Get QR code for event
- `DELETE /api/events/:id` - Delete event

### Attendance
- `POST /api/attendance/checkin` - Record check-in
- `GET /api/attendance/event/:eventId` - Get attendance for event
- `GET /api/attendance/class/:classId/stats` - Get attendance stats for class

## Database Schema

The SQLite database includes the following tables:
- `classes` - Class information
- `students` - Student information
- `events` - Event/session information with QR tokens
- `attendance` - Check-in records
- `class_students` - Many-to-many relationship between classes and students

## License

MIT