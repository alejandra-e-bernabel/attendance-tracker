import { Router, Request, Response } from 'express';
import { ClassModel } from '../models/classModel.js';

const router = Router();

// Get all classes
router.get('/', (req: Request, res: Response) => {
  try {
    const classes = ClassModel.findAll();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get class by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const classData = ClassModel.findById(parseInt(req.params.id));
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

// Create new class
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Class name is required' });
    }
    const newClass = ClassModel.create({ name, description });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Update class
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Class name is required' });
    }
    const updated = ClassModel.update(parseInt(req.params.id), { name, description });
    if (!updated) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json({ message: 'Class updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Delete class
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = ClassModel.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

// Get students in class
router.get('/:id/students', (req: Request, res: Response) => {
  try {
    const students = ClassModel.getStudents(parseInt(req.params.id));
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Add student to class
router.post('/:id/students/:studentId', (req: Request, res: Response) => {
  try {
    const added = ClassModel.addStudent(
      parseInt(req.params.id),
      parseInt(req.params.studentId)
    );
    if (!added) {
      return res.status(400).json({ error: 'Failed to add student to class' });
    }
    res.json({ message: 'Student added to class successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add student to class' });
  }
});

// Remove student from class
router.delete('/:id/students/:studentId', (req: Request, res: Response) => {
  try {
    const removed = ClassModel.removeStudent(
      parseInt(req.params.id),
      parseInt(req.params.studentId)
    );
    if (!removed) {
      return res.status(404).json({ error: 'Student not found in class' });
    }
    res.json({ message: 'Student removed from class successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove student from class' });
  }
});

export default router;
