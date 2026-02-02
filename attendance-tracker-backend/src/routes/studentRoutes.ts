import { Router, Request, Response } from 'express';
import { StudentModel } from '../models/studentModel.js';

const router = Router();

// Get all students
router.get('/', (req: Request, res: Response) => {
  try {
    const students = StudentModel.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const student = StudentModel.findById(parseInt(req.params.id));
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create new student
router.post('/', (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, gtid } = req.body;

    if (!first_name || !last_name || !email || !gtid) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for duplicates
    if (StudentModel.findByEmail(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    if (StudentModel.findByGtid(gtid)) {
      return res.status(400).json({ error: 'GTID already exists' });
    }

    const newStudent = StudentModel.create({ first_name, last_name, email, gtid });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, gtid } = req.body;

    if (!first_name || !last_name || !email || !gtid) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updated = StudentModel.update(parseInt(req.params.id), {
      first_name,
      last_name,
      email,
      gtid
    });

    if (!updated) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = StudentModel.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Get classes for student
router.get('/:id/classes', (req: Request, res: Response) => {
  try {
    const classes = StudentModel.getClasses(parseInt(req.params.id));
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

export default router;
