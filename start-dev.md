# Quick Start Guide

## Running the Application

You need to run both the backend and frontend servers simultaneously.

### Option 1: Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd attendance-tracker-backend
npm run dev
```
Server will start at: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd attendance-tracker-frontend
npm run dev
```
App will start at: http://localhost:5173 (or next available port)

### Option 2: Using VS Code

1. Open two integrated terminals in VS Code (Terminal → New Terminal)
2. In first terminal: `cd attendance-tracker-backend && npm run dev`
3. In second terminal: `cd attendance-tracker-frontend && npm run dev`

## First Time Setup

After starting both servers:

1. Open http://localhost:5173 in your browser
2. Add some students (Students → Add Student)
3. Create a class (Classes → Add Class)
4. Add students to the class
5. Create an event for the class (Events → Create Event)
6. View the QR code for the event (Events → View QR)
7. Test check-in (Check In → Select student → Scan QR or enter token)

## Stopping the Servers

- Press `Ctrl + C` in each terminal window to stop the servers
