import { db } from '../firebase/config';
import { collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { AutomationService } from '../../server/src/services/automationService';

export class TaskService {
  private static instance: TaskService;
  private readonly COLLECTION = 'tasks';
  private automationService: AutomationService;

  private constructor() {
    this.automationService = AutomationService.getInstance();
  }

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async updateTaskStatus(taskId: string, newStatus: string): Promise<void> {
    const taskRef = doc(db, this.COLLECTION, taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const taskData = taskDoc.data();
    await updateDoc(taskRef, { status: newStatus });

    // Trigger automation for status change
    await this.automationService.checkAndTriggerAutomations(
      taskData.projectId,
      'TASK_STATUS_CHANGE',
      {
        taskId,
        status: newStatus,
        userId: taskData.assigneeId,
      }
    );
  }

  async assignTask(taskId: string, assigneeId: string): Promise<void> {
    const taskRef = doc(db, this.COLLECTION, taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const taskData = taskDoc.data();
    await updateDoc(taskRef, { assigneeId });

    // Trigger automation for task assignment
    await this.automationService.checkAndTriggerAutomations(
      taskData.projectId,
      'TASK_ASSIGNMENT',
      {
        taskId,
        assigneeId,
        status: taskData.status,
      }
    );
  }

  async checkDueDates(): Promise<void> {
    const now = new Date().toISOString();
    const tasksRef = collection(db, this.COLLECTION);
    const tasksSnapshot = await getDocs(
      query(
        tasksRef,
        where('dueDate', '<=', now),
        where('status', '!=', 'Done')
      )
    );

    for (const taskDoc of tasksSnapshot.docs) {
      const taskData = taskDoc.data();
      
      // Trigger automation for due date passed
      await this.automationService.checkAndTriggerAutomations(
        taskData.projectId,
        'DUE_DATE_PASSED',
        {
          taskId: taskDoc.id,
          dueDate: taskData.dueDate,
          userId: taskData.assigneeId,
        }
      );
    }
  }
} 