import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import KanbanBoard from '../components/project/KanbanBoard';
import useProjectStore from '../store/projectStore';
import useTaskStore from '../store/taskStore';
import { ChevronDown, Clock } from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, fetchProject, updateProject } = useProjectStore();
  const { fetchProjectTasks, tasks } = useTaskStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (!projectId) return;
      setIsLoading(true);
      setError(null);

      try {
        await Promise.all([fetchProject(projectId), fetchProjectTasks(projectId)]);
      } catch (error) {
        if (mounted) {
          setError('Failed to load project data. Please try again.');
          console.error('Error loading project data:', error);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, [projectId, fetchProject, fetchProjectTasks]);

  const handleStatusChange = async (newStatus: 'active' | 'completed' | 'archived') => {
    if (!projectId) return;
    try {
      await updateProject(projectId, { status: newStatus });
      // Project will be automatically updated in the store and reflect on the dashboard
    } catch (error) {
      setError('Failed to update project status. Please try again.');
      console.error('Error updating project status:', error);
    }
  };

  if (!projectId) return <Navigate to="/" replace />;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{currentProject?.name}</h1>
              <div className="flex items-center gap-4">
                <select
                  value={currentProject?.status || 'active'}
                  onChange={(e) => handleStatusChange(e.target.value as 'active' | 'completed' | 'archived')}
                  className="px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <KanbanBoard tasks={tasks} projectId={projectId} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetail;