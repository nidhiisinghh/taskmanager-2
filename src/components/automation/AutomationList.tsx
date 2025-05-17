import React, { useState } from 'react';
import { Automation } from '../../types/automation';
import AutomationForm from './AutomationForm';

interface AutomationListProps {
  projectId: string;
  automations: Automation[];
  onAdd: (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Automation>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const AutomationList: React.FC<AutomationListProps> = ({
  projectId,
  automations,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleToggleActive = async (automation: Automation) => {
    await onUpdate(automation.id, { isActive: !automation.isActive });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      await onDelete(id);
    }
  };

  const getTriggerDescription = (automation: Automation) => {
    switch (automation.trigger.type) {
      case 'TASK_STATUS_CHANGE':
        return `When task status changes to "${automation.trigger.conditions.status}"`;
      case 'TASK_ASSIGNMENT':
        return `When task is assigned to user ${automation.trigger.conditions.assigneeId}`;
      case 'DUE_DATE_PASSED':
        return `When due date ${automation.trigger.conditions.dueDate} passes`;
      default:
        return 'Unknown trigger';
    }
  };

  const getActionDescription = (automation: Automation) => {
    switch (automation.action.type) {
      case 'ASSIGN_BADGE':
        return `Assign badge ${automation.action.params.badgeId}`;
      case 'CHANGE_STATUS':
        return `Change status to "${automation.action.params.newStatus}"`;
      case 'SEND_NOTIFICATION':
        return `Send notification: "${automation.action.params.notificationMessage}"`;
      default:
        return 'Unknown action';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Project Automations</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Automation
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">New Automation</h3>
          <AutomationForm
            projectId={projectId}
            onSubmit={async (automation) => {
              await onAdd(automation);
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {automations.map((automation) => (
            <li key={automation.id}>
              {editingId === automation.id ? (
                <div className="p-6">
                  <AutomationForm
                    projectId={projectId}
                    initialData={automation}
                    onSubmit={async (updatedAutomation) => {
                      await onUpdate(automation.id, updatedAutomation);
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {automation.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {getTriggerDescription(automation)} → {getActionDescription(automation)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleToggleActive(automation)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          automation.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {automation.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => setEditingId(automation.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(automation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AutomationList; 