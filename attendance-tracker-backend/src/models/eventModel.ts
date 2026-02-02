import db from '../database.js';
import { Event, EventWithClass } from './types.js';
import { v4 as uuidv4 } from 'uuid';

export const EventModel = {
  create(eventData: Event): Event {
    const qrToken = uuidv4();
    const expiresAt = eventData.expires_at || null;

    const stmt = db.prepare(
      'INSERT INTO events (class_id, name, event_date, qr_token, expires_at) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      eventData.class_id,
      eventData.name,
      eventData.event_date,
      qrToken,
      expiresAt
    );

    return {
      id: result.lastInsertRowid as number,
      ...eventData,
      qr_token: qrToken,
      expires_at: expiresAt || undefined
    };
  },

  findAll(): EventWithClass[] {
    const stmt = db.prepare(`
      SELECT e.*, c.name as class_name
      FROM events e
      JOIN classes c ON e.class_id = c.id
      ORDER BY e.event_date DESC
    `);
    return stmt.all() as EventWithClass[];
  },

  findById(id: number): EventWithClass | undefined {
    const stmt = db.prepare(`
      SELECT e.*, c.name as class_name
      FROM events e
      JOIN classes c ON e.class_id = c.id
      WHERE e.id = ?
    `);
    return stmt.get(id) as EventWithClass | undefined;
  },

  findByClassId(classId: number): EventWithClass[] {
    const stmt = db.prepare(`
      SELECT e.*, c.name as class_name
      FROM events e
      JOIN classes c ON e.class_id = c.id
      WHERE e.class_id = ?
      ORDER BY e.event_date DESC
    `);
    return stmt.all(classId) as EventWithClass[];
  },

  findByQrToken(qrToken: string): Event | undefined {
    const stmt = db.prepare('SELECT * FROM events WHERE qr_token = ?');
    return stmt.get(qrToken) as Event | undefined;
  },

  update(id: number, eventData: Partial<Event>): boolean {
    const stmt = db.prepare(
      'UPDATE events SET name = ?, event_date = ?, expires_at = ? WHERE id = ?'
    );
    const result = stmt.run(
      eventData.name,
      eventData.event_date,
      eventData.expires_at || null,
      id
    );
    return result.changes > 0;
  },

  delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  isQrTokenValid(qrToken: string): boolean {
    const event = this.findByQrToken(qrToken);
    if (!event) return false;

    // Check if token has expired
    if (event.expires_at) {
      const expiresAt = new Date(event.expires_at);
      const now = new Date();
      if (now > expiresAt) return false;
    }

    return true;
  }
};
