import { create } from 'zustand';
import { projectApi } from '../services/api';

interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  members: string[];
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (data: { name: string; description?: string }) => Promise<void>;
  updateProject: (id: string, data: { name?: string; description?: string; status?: string }) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addMember: (id: string, memberId: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
}

const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const projects = await projectApi.getAll();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchProject: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const project = await projectApi.getOne(id);
      set({ currentProject: project, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createProject: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const newProject = await projectApi.create(data);
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateProject: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProject = await projectApi.update(id, data);
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === id ? updatedProject : p
        ),
        currentProject:
          state.currentProject?._id === id ? updatedProject : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteProject: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await projectApi.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        currentProject: state.currentProject?._id === id ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addMember: async (id, memberId) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProject = await projectApi.addMember(id, memberId);
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === id ? updatedProject : p
        ),
        currentProject:
          state.currentProject?._id === id ? updatedProject : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),
  clearError: () => set({ error: null }),
}));

export default useProjectStore;