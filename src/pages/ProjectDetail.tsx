import React from 'react';
import { useParams } from 'react-router-dom';
import { useAutomations } from '../hooks/useAutomations';
import AutomationList from '../components/automation/AutomationList';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    automations,
    loading,
    error,
    addAutomation,
    updateAutomation,
    deleteAutomation,
  } = useAutomations(projectId!);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your project settings and automations
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <AutomationList
              projectId={projectId!}
              automations={automations}
              onAdd={addAutomation}
              onUpdate={updateAutomation}
              onDelete={deleteAutomation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;