import db from '../database.js';
import { Class } from './types.js';

export const ClassModel = {
  create(classData: Class): Class {
    const stmt = db.prepare('INSERT INTO classes (name, description) VALUES (?, ?)');
    const result = stmt.run(classData.name, classData.description || null);
    return { id: result.lastInsertRowid as number, ...classData };
  },

  findAll(): Class[] {
    const stmt = db.prepare('SELECT * FROM classes ORDER BY created_at DESC');
    return stmt.all() as Class[];
  },

  findById(id: number): Class | undefined {
    const stmt = db.prepare('SELECT * FROM classes WHERE id = ?');
    return stmt.get(id) as Class | undefined;
  },

  update(id: number, classData: Partial<Class>): boolean {
    const stmt = db.prepare('UPDATE classes SET name = ?, description = ? WHERE id = ?');
    const result = stmt.run(classData.name, classData.description, id);
    return result.changes > 0;
  },

  delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM classes WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  getStudents(classId: number) {
    const stmt = db.prepare(`
      SELECT s.* FROM students s
      JOIN class_students cs ON s.id = cs.student_id
      WHERE cs.class_id = ?
      ORDER BY s.last_name, s.first_name
    `);
    return stmt.all(classId);
  },

  addStudent(classId: number, studentId: number): boolean {
    try {
      const stmt = db.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)');
      stmt.run(classId, studentId);
      return true;
    } catch (error) {
      return false;
    }
  },

  removeStudent(classId: number, studentId: number): boolean {
    const stmt = db.prepare('DELETE FROM class_students WHERE class_id = ? AND student_id = ?');
    const result = stmt.run(classId, studentId);
    return result.changes > 0;
  }
};
