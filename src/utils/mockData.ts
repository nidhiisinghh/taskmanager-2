import { Project, Task, Status } from '../types';

// Default statuses for new projects
export const defaultStatuses: Status[] = [
  { id: 'status-1', name: 'To Do', color: '#3B82F6', order: 0 },
  { id: 'status-2', name: 'In Progress', color: '#EAB308', order: 1 },
  { id: 'status-3', name: 'Done', color: '#22C55E', order: 2 },
];

// Mock projects data
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Website Redesign',
    description: 'Complete overhaul of the company website with improved UX and modern design elements.',
    ownerId: 'user-1',
    members: ['user-1', 'user-2', 'user-3'],
    statuses: [...defaultStatuses],
    createdAt: new Date(2023, 5, 15).toISOString(),
    updatedAt: new Date(2023, 6, 20).toISOString(),
  },
  {
    id: 'project-2',
    title: 'Mobile App Development',
    description: 'Building a cross-platform mobile application for customer engagement and retention.',
    ownerId: 'user-1',
    members: ['user-1', 'user-4'],
    statuses: [...defaultStatuses],
    createdAt: new Date(2023, 7, 10).toISOString(),
    updatedAt: new Date(2023, 8, 5).toISOString(),
  },
  {
    id: 'project-3',
    title: 'Marketing Campaign',
    description: 'Q3 marketing campaign focusing on product launch and brand awareness.',
    ownerId: 'user-2',
    members: ['user-1', 'user-2', 'user-5'],
    statuses: [
      ...defaultStatuses,
      { id: 'status-4', name: 'Review', color: '#A855F7', order: 1.5 },
    ],
    createdAt: new Date(2023, 8, 20).toISOString(),
    updatedAt: new Date(2023, 9, 15).toISOString(),
  },
];

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Create wireframes for homepage',
    description: 'Design initial wireframes for the homepage layout based on client requirements.',
    statusId: 'status-2',
    assigneeId: 'user-2',
    dueDate: new Date(2023, 10, 15).toISOString(),
    createdById: 'user-1',
    createdAt: new Date(2023, 9, 20).toISOString(),
    updatedAt: new Date(2023, 9, 22).toISOString(),
    comments: [],
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: 'Implement responsive navigation',
    description: 'Develop responsive navigation menu that works across all devices and screen sizes.',
    statusId: 'status-1',
    assigneeId: 'user-3',
    dueDate: new Date(2023, 10, 20).toISOString(),
    createdById: 'user-1',
    createdAt: new Date(2023, 9, 21).toISOString(),
    updatedAt: new Date(2023, 9, 21).toISOString(),
    comments: [],
  },
  {
    id: 'task-3',
    projectId: 'project-2',
    title: 'Design user authentication flow',
    description: 'Create a comprehensive user authentication flow including login, registration, and password recovery.',
    statusId: 'status-3',
    assigneeId: 'user-4',
    dueDate: new Date(2023, 9, 30).toISOString(),
    createdById: 'user-1',
    createdAt: new Date(2023, 9, 10).toISOString(),
    updatedAt: new Date(2023, 9, 25).toISOString(),
    comments: [],
  },
  {
    id: 'task-4',
    projectId: 'project-3',
    title: 'Create social media content calendar',
    description: 'Develop a content calendar for social media posts related to the product launch.',
    statusId: 'status-4',
    assigneeId: 'user-5',
    dueDate: new Date(2023, 10, 5).toISOString(),
    createdById: 'user-2',
    createdAt: new Date(2023, 9, 15).toISOString(),
    updatedAt: new Date(2023, 9, 28).toISOString(),
    comments: [],
  },
  {
    id: 'task-5',
    projectId: 'project-1',
    title: 'Optimize images for web',
    description: 'Compress and optimize all image assets for web performance.',
    statusId: 'status-2',
    assigneeId: 'user-1',
    dueDate: new Date(2023, 10, 12).toISOString(),
    createdById: 'user-3',
    createdAt: new Date(2023, 9, 22).toISOString(),
    updatedAt: new Date(2023, 9, 24).toISOString(),
    comments: [],
  },
];