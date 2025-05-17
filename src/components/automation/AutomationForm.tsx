import React, { useState } from 'react';
import { Automation, AutomationTrigger, AutomationAction } from '../../types/automation';

interface AutomationFormProps {
  projectId: string;
  initialData?: Partial<Automation>;
  onSubmit: (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

const AutomationForm: React.FC<AutomationFormProps> = ({
  projectId,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [trigger, setTrigger] = useState<AutomationTrigger>(initialData?.trigger?.type || 'TASK_STATUS_CHANGE');
  const [action, setAction] = useState<AutomationAction>(initialData?.action?.type || 'ASSIGN_BADGE');
  const [conditions, setConditions] = useState(initialData?.trigger?.conditions || {});
  const [actionParams, setActionParams] = useState(initialData?.action?.params || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        projectId,
        name,
        trigger: {
          type: trigger,
          conditions,
        },
        action: {
          type: action,
          params: actionParams,
        },
        isActive: true,
      });
    } catch (error) {
      console.error('Failed to save automation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTriggerFields = () => {
    switch (trigger) {
      case 'TASK_STATUS_CHANGE':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              value={conditions.status || ''}
              onChange={(e) => setConditions({ ...conditions, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Done"
            />
          </div>
        );
      case 'TASK_ASSIGNMENT':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Assignee ID</label>
            <input
              type="text"
              value={conditions.assigneeId || ''}
              onChange={(e) => setConditions({ ...conditions, assigneeId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="User ID"
            />
          </div>
        );
      case 'DUE_DATE_PASSED':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={conditions.dueDate || ''}
              onChange={(e) => setConditions({ ...conditions, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        );
    }
  };

  const renderActionFields = () => {
    switch (action) {
      case 'ASSIGN_BADGE':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Badge ID</label>
            <input
              type="text"
              value={actionParams.badgeId || ''}
              onChange={(e) => setActionParams({ ...actionParams, badgeId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Badge ID"
            />
          </div>
        );
      case 'CHANGE_STATUS':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">New Status</label>
            <input
              type="text"
              value={actionParams.newStatus || ''}
              onChange={(e) => setActionParams({ ...actionParams, newStatus: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., In Progress"
            />
          </div>
        );
      case 'SEND_NOTIFICATION':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Notification Message</label>
            <textarea
              value={actionParams.notificationMessage || ''}
              onChange={(e) => setActionParams({ ...actionParams, notificationMessage: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter notification message"
              rows={3}
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Automation Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Trigger</label>
        <select
          value={trigger}
          onChange={(e) => setTrigger(e.target.value as AutomationTrigger)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="TASK_STATUS_CHANGE">Task Status Change</option>
          <option value="TASK_ASSIGNMENT">Task Assignment</option>
          <option value="DUE_DATE_PASSED">Due Date Passed</option>
        </select>
      </div>

      {renderTriggerFields()}

      <div>
        <label className="block text-sm font-medium text-gray-700">Action</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value as AutomationAction)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="ASSIGN_BADGE">Assign Badge</option>
          <option value="CHANGE_STATUS">Change Status</option>
          <option value="SEND_NOTIFICATION">Send Notification</option>
        </select>
      </div>

      {renderActionFields()}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Automation'}
        </button>
      </div>
    </form>
  );
};

export default AutomationForm; 