import { db } from '../config/firebase';
import { Automation, AutomationRule } from '../../src/types/automation';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export class AutomationService {
  private static instance: AutomationService;
  private readonly COLLECTION = 'automations';

  private constructor() {}

  static getInstance(): AutomationService {
    if (!AutomationService.instance) {
      AutomationService.instance = new AutomationService();
    }
    return AutomationService.instance;
  }

  async createAutomation(automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Automation> {
    const now = new Date().toISOString();
    const automationData = {
      ...automation,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, this.COLLECTION), automationData);
    return {
      ...automationData,
      id: docRef.id,
    };
  }

  async getProjectAutomations(projectId: string): Promise<Automation[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where('projectId', '==', projectId),
      where('isActive', '==', true)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Automation));
  }

  async updateAutomation(id: string, updates: Partial<Automation>): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteAutomation(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await deleteDoc(docRef);
  }

  async checkAndTriggerAutomations(
    projectId: string,
    trigger: Automation['trigger']['type'],
    context: Record<string, any>
  ): Promise<void> {
    const automations = await this.getProjectAutomations(projectId);
    
    for (const automation of automations) {
      if (automation.trigger.type !== trigger) continue;

      const shouldTrigger = this.evaluateConditions(automation.trigger.conditions, context);
      if (shouldTrigger) {
        await this.executeAction(automation.action, context);
      }
    }
  }

  private evaluateConditions(
    conditions: Automation['trigger']['conditions'],
    context: Record<string, any>
  ): boolean {
    if (conditions.status && context.status !== conditions.status) return false;
    if (conditions.assigneeId && context.assigneeId !== conditions.assigneeId) return false;
    if (conditions.dueDate && new Date(context.dueDate) > new Date(conditions.dueDate)) return false;
    return true;
  }

  private async executeAction(
    action: Automation['action'],
    context: Record<string, any>
  ): Promise<void> {
    switch (action.type) {
      case 'ASSIGN_BADGE':
        await this.assignBadge(context.userId, action.params.badgeId!);
        break;
      case 'CHANGE_STATUS':
        await this.changeTaskStatus(context.taskId, action.params.newStatus!);
        break;
      case 'SEND_NOTIFICATION':
        await this.sendNotification(context.userId, action.params.notificationMessage!);
        break;
    }
  }

  private async assignBadge(userId: string, badgeId: string): Promise<void> {
    // Implement badge assignment logic
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      badges: arrayUnion(badgeId)
    });
  }

  private async changeTaskStatus(taskId: string, newStatus: string): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { status: newStatus });
  }

  private async sendNotification(userId: string, message: string): Promise<void> {
    // Implement notification sending logic
    const notification = {
      userId,
      message,
      createdAt: new Date().toISOString(),
      read: false
    };
    await addDoc(collection(db, 'notifications'), notification);
  }
} 