export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  badges: Badge[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  members: string[]; // User IDs
  statuses: Status[];
  createdAt: string;
  updatedAt: string;
}

export interface Status {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  statusId: string;
  assigneeId?: string;
  dueDate?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Automation {
  id: string;
  projectId: string;
  triggerType: AutomationTriggerType;
  triggerValue: string;
  actionType: AutomationActionType;
  actionValue: string;
  createdAt: string;
}

export enum AutomationTriggerType {
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  DUE_DATE_PASSED = 'DUE_DATE_PASSED',
}

export enum AutomationActionType {
  ASSIGN_BADGE = 'ASSIGN_BADGE',
  CHANGE_TASK_STATUS = 'CHANGE_TASK_STATUS',
  SEND_NOTIFICATION = 'SEND_NOTIFICATION',
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}