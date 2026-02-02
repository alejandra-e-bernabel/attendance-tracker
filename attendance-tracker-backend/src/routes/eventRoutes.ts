import { Router, Request, Response } from 'express';
import { EventModel } from '../models/eventModel.js';
import QRCode from 'qrcode';

const router = Router();

// Get all events
router.get('/', (req: Request, res: Response) => {
  try {
    const events = EventModel.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const event = EventModel.findById(parseInt(req.params.id));
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Get events by class ID
router.get('/class/:classId', (req: Request, res: Response) => {
  try {
    const events = EventModel.findByClassId(parseInt(req.params.classId));
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create new event
router.post('/', (req: Request, res: Response) => {
  try {
    const { class_id, name, event_date, expires_at } = req.body;

    if (!class_id || !name || !event_date) {
      return res.status(400).json({ error: 'Class ID, name, and event date are required' });
    }

    const newEvent = EventModel.create({
      class_id,
      name,
      event_date,
      expires_at
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { name, event_date, expires_at } = req.body;

    if (!name || !event_date) {
      return res.status(400).json({ error: 'Name and event date are required' });
    }

    const updated = EventModel.update(parseInt(req.params.id), {
      name,
      event_date,
      expires_at
    });

    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = EventModel.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Generate QR code for event
router.get('/:id/qr', async (req: Request, res: Response) => {
  try {
    const event = EventModel.findById(parseInt(req.params.id));
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(event.qr_token || '');
    res.json({
      qr_token: event.qr_token,
      qr_code: qrCodeDataUrl,
      event_name: event.name,
      class_name: event.class_name
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

export default router;
