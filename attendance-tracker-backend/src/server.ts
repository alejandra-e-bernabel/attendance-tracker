import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database.js';
import classRoutes from './routes/classRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Initialize database
initializeDatabase();

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/classes', authenticateToken, classRoutes);
app.use('/api/students', authenticateToken, studentRoutes);
app.use('/api/events', authenticateToken, eventRoutes);
app.use('/api/attendance', authenticateToken, attendanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Attendance Tracker API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
