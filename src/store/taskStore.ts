import { create } from 'zustand';
import { taskApi } from '../services/api';

interface Comment {
  text: string;
  user: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: string;
  assignee?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdBy: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface TaskStore {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  fetchProjectTasks: (projectId: string) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (data: {
    title: string;
    description?: string;
    projectId: string;
    assignee?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }) => Promise<void>;
  updateTask: (id: string, data: {
    title?: string;
    description?: string;
    assignee?: string;
    status?: 'todo' | 'in-progress' | 'review' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (id: string, text: string) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
  clearError: () => void;
}

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  fetchProjectTasks: async (projectId) => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await taskApi.getProjectTasks(projectId);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const task = await taskApi.getOne(id);
      set({ currentTask: task, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createTask: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const newTask = await taskApi.create(data);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateTask: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedTask = await taskApi.update(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t._id === id ? updatedTask : t
        ),
        currentTask:
          state.currentTask?._id === id ? updatedTask : state.currentTask,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await taskApi.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        currentTask: state.currentTask?._id === id ? null : state.currentTask,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addComment: async (id, text) => {
    try {
      set({ isLoading: true, error: null });
      await taskApi.addComment(id, text);
      const updatedTask = await taskApi.getOne(id);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t._id === id ? updatedTask : t
        ),
        currentTask:
          state.currentTask?._id === id ? updatedTask : state.currentTask,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setCurrentTask: (task) => set({ currentTask: task }),
  clearError: () => set({ error: null }),
}));

export default useTaskStore;