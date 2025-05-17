export type AutomationTrigger = 
  | 'TASK_STATUS_CHANGE'
  | 'TASK_ASSIGNMENT'
  | 'DUE_DATE_PASSED';

export type AutomationAction = 
  | 'ASSIGN_BADGE'
  | 'CHANGE_STATUS'
  | 'SEND_NOTIFICATION';

export interface Automation {
  id: string;
  projectId: string;
  name: string;
  trigger: {
    type: AutomationTrigger;
    conditions: {
      status?: string;
      assigneeId?: string;
      dueDate?: string;
    };
  };
  action: {
    type: AutomationAction;
    params: {
      badgeId?: string;
      newStatus?: string;
      notificationMessage?: string;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  projectId: string;
  name: string;
  trigger: AutomationTrigger;
  conditions: Record<string, any>;
  action: AutomationAction;
  actionParams: Record<string, any>;
  isActive: boolean;
} 