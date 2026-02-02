import { Router, Request, Response } from 'express';
import { AttendanceModel } from '../models/attendanceModel.js';
import { EventModel } from '../models/eventModel.js';
import { StudentModel } from '../models/studentModel.js';

const router = Router();

// Record check-in via QR token
router.post('/checkin', (req: Request, res: Response) => {
  try {
    const { qr_token, student_id } = req.body;

    if (!qr_token || !student_id) {
      return res.status(400).json({ error: 'QR token and student ID are required' });
    }

    // Validate QR token
    if (!EventModel.isQrTokenValid(qr_token)) {
      return res.status(400).json({ error: 'Invalid or expired QR code' });
    }

    // Get event
    const event = EventModel.findByQrToken(qr_token);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if student exists
    const student = StudentModel.findById(student_id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if already checked in
    if (AttendanceModel.hasCheckedIn(event.id!, student_id)) {
      return res.status(400).json({ error: 'Already checked in to this event' });
    }

    // Record attendance
    const attendance = AttendanceModel.recordCheckIn(event.id!, student_id);
    if (!attendance) {
      return res.status(500).json({ error: 'Failed to record check-in' });
    }

    res.status(201).json({
      message: 'Check-in successful',
      attendance,
      event_name: event.name
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process check-in' });
  }
});

// Get attendance for an event
router.get('/event/:eventId', (req: Request, res: Response) => {
  try {
    const attendance = AttendanceModel.findByEventId(parseInt(req.params.eventId));
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get attendance for a student
router.get('/student/:studentId', (req: Request, res: Response) => {
  try {
    const attendance = AttendanceModel.findByStudentId(parseInt(req.params.studentId));
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get attendance stats for a class
router.get('/class/:classId/stats', (req: Request, res: Response) => {
  try {
    const stats = AttendanceModel.getAttendanceStats(parseInt(req.params.classId));
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance stats' });
  }
});

export default router;
