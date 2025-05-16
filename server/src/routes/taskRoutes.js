import express from 'express';
import {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
  addComment
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/project/:projectId', getProjectTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/comments', addComment);

export default router; 