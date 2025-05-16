import Task from '../models/Task.js';
import Project from '../models/Project.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignee, priority, dueDate } = req.body;
    
    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.owner !== req.user.uid && !project.members.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignee,
      priority,
      dueDate,
      createdBy: req.user.uid
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks for a project
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.owner !== req.user.uid && !project.members.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify project access
    const project = await Project.findById(task.project);
    if (project.owner !== req.user.uid && !project.members.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify project access
    const project = await Project.findById(task.project);
    if (project.owner !== req.user.uid && !project.members.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify project access
    const project = await Project.findById(task.project);
    if (project.owner !== req.user.uid && !project.members.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add comment to task
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify project access
    const project = await Project.findById(task.project);
    if (project.owner !== req.user.uid && !project.members.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    task.comments.push({
      text,
      user: req.user.uid
    });

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 