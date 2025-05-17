import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import useProjectStore from '../store/projectStore';
import useTaskStore from '../store/taskStore';
import KanbanBoard from '../components/project/KanbanBoard';

const Tasks = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchProjectTasks } = useTaskStore();

  useEffect(() => {
    const loadAllTasks = async () => {
      const fetchedProjects = await fetchProjects();
      // Only fetch tasks if we haven't fetched them before
      if (fetchedProjects.length > 0 && tasks.length === 0) {
        await Promise.all(
          fetchedProjects.map(project => fetchProjectTasks(project._id))
        );
      }
    };
    loadAllTasks();
  }, [fetchProjects, fetchProjectTasks, tasks.length]);

  // Filter tasks based on the URL parameter
  const filteredTasks = tasks.filter(task => {
    if (!filter) return true;
    switch (filter) {
      case 'active':
        return task.status !== 'completed';
      case 'completed':
        return task.status === 'completed';
      case 'due-soon':
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        if (!dueDate) return false;
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return dueDate > today && dueDate < nextWeek;
      default:
        return true;
    }
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : 'All'} Tasks
          </h1>
        </header>
        <KanbanBoard tasks={filteredTasks} projectId="all" />
      </div>
    </Layout>
  );
};

export default Tasks;