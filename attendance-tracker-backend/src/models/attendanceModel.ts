import db from '../database.js';
import { Attendance, AttendanceRecord } from './types.js';

export const AttendanceModel = {
  recordCheckIn(eventId: number, studentId: number): Attendance | null {
    try {
      const stmt = db.prepare(
        'INSERT INTO attendance (event_id, student_id) VALUES (?, ?)'
      );
      const result = stmt.run(eventId, studentId);
      return {
        id: result.lastInsertRowid as number,
        event_id: eventId,
        student_id: studentId
      };
    } catch (error) {
      // Handle duplicate check-in
      return null;
    }
  },

  findByEventId(eventId: number): AttendanceRecord[] {
    const stmt = db.prepare(`
      SELECT
        a.*,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.email as student_email,
        s.gtid as student_gtid
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.event_id = ?
      ORDER BY a.check_in_time DESC
    `);
    return stmt.all(eventId) as AttendanceRecord[];
  },

  findByStudentId(studentId: number): AttendanceRecord[] {
    const stmt = db.prepare(`
      SELECT
        a.*,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.email as student_email,
        s.gtid as student_gtid
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.student_id = ?
      ORDER BY a.check_in_time DESC
    `);
    return stmt.all(studentId) as AttendanceRecord[];
  },

  hasCheckedIn(eventId: number, studentId: number): boolean {
    const stmt = db.prepare(
      'SELECT id FROM attendance WHERE event_id = ? AND student_id = ?'
    );
    const result = stmt.get(eventId, studentId);
    return result !== undefined;
  },

  getAttendanceStats(classId: number) {
    const stmt = db.prepare(`
      SELECT
        s.id,
        s.first_name,
        s.last_name,
        s.email,
        s.gtid,
        COUNT(DISTINCT e.id) as total_events,
        COUNT(DISTINCT a.event_id) as events_attended
      FROM students s
      JOIN class_students cs ON s.id = cs.student_id
      LEFT JOIN events e ON e.class_id = cs.class_id
      LEFT JOIN attendance a ON a.student_id = s.id AND a.event_id = e.id
      WHERE cs.class_id = ?
      GROUP BY s.id
      ORDER BY s.last_name, s.first_name
    `);
    return stmt.all(classId);
  }
};
