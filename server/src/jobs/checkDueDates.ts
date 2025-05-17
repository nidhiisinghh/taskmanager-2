import { TaskService } from '../services/taskService';

export class DueDateChecker {
  private static instance: DueDateChecker;
  private taskService: TaskService;
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 1000 * 60 * 60; // Check every hour

  private constructor() {
    this.taskService = TaskService.getInstance();
  }

  static getInstance(): DueDateChecker {
    if (!DueDateChecker.instance) {
      DueDateChecker.instance = new DueDateChecker();
    }
    return DueDateChecker.instance;
  }

  start(): void {
    if (this.checkInterval) {
      console.log('Due date checker is already running');
      return;
    }

    console.log('Starting due date checker...');
    this.checkInterval = setInterval(async () => {
      try {
        await this.taskService.checkDueDates();
      } catch (error) {
        console.error('Error checking due dates:', error);
      }
    }, this.CHECK_INTERVAL);

    // Run initial check
    this.taskService.checkDueDates().catch((error) => {
      console.error('Error in initial due date check:', error);
    });
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Due date checker stopped');
    }
  }
} 