import db from '../database.js';
import { Student } from './types.js';

export const StudentModel = {
  create(studentData: Student): Student {
    const stmt = db.prepare(
      'INSERT INTO students (first_name, last_name, email, gtid) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(
      studentData.first_name,
      studentData.last_name,
      studentData.email,
      studentData.gtid
    );
    return { id: result.lastInsertRowid as number, ...studentData };
  },

  findAll(): Student[] {
    const stmt = db.prepare('SELECT * FROM students ORDER BY last_name, first_name');
    return stmt.all() as Student[];
  },

  findById(id: number): Student | undefined {
    const stmt = db.prepare('SELECT * FROM students WHERE id = ?');
    return stmt.get(id) as Student | undefined;
  },

  findByEmail(email: string): Student | undefined {
    const stmt = db.prepare('SELECT * FROM students WHERE email = ?');
    return stmt.get(email) as Student | undefined;
  },

  findByGtid(gtid: string): Student | undefined {
    const stmt = db.prepare('SELECT * FROM students WHERE gtid = ?');
    return stmt.get(gtid) as Student | undefined;
  },

  update(id: number, studentData: Partial<Student>): boolean {
    const stmt = db.prepare(
      'UPDATE students SET first_name = ?, last_name = ?, email = ?, gtid = ? WHERE id = ?'
    );
    const result = stmt.run(
      studentData.first_name,
      studentData.last_name,
      studentData.email,
      studentData.gtid,
      id
    );
    return result.changes > 0;
  },

  delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM students WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  getClasses(studentId: number) {
    const stmt = db.prepare(`
      SELECT c.* FROM classes c
      JOIN class_students cs ON c.id = cs.class_id
      WHERE cs.student_id = ?
      ORDER BY c.name
    `);
    return stmt.all(studentId);
  }
};
