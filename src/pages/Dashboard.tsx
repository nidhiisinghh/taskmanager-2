import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CreateProjectModal from '../components/project/CreateProjectModal';
import { 
  Plus, Calendar, CheckCircle, Clock, 
  AlertCircle, MoreHorizontal, Folder, Trash2 
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useProjectStore from '../store/projectStore';
import useTaskStore from '../store/taskStore';
import { format, addDays, isAfter, isBefore } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, fetchProjects, deleteProject } = useProjectStore();
  const { tasks, fetchProjectTasks, deleteTask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedProjects = await fetchProjects();
        
        if (Array.isArray(fetchedProjects) && fetchedProjects.length > 0) {
          const taskPromises = fetchedProjects.map(project => 
            fetchProjectTasks(project._id).catch(error => {
              console.error(`Error fetching tasks for project ${project._id}:`, error);
              return null; // Continue with other projects if one fails
            })
          );
          await Promise.all(taskPromises);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [fetchProjects, fetchProjectTasks, user]);
  
  // Calculate completed tasks count
  const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
  
  // Calculate tasks due soon (within next 7 days)
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const dueSoonTasksCount = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return isAfter(dueDate, today) && isBefore(dueDate, nextWeek);
  }).length;

  const handleCardClick = (filter: string) => {
    navigate(`/tasks?filter=${filter}`);
  };
  
  // Add this function to handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      // Refresh the tasks list
      if (projects.length > 0) {
        await Promise.all(projects.map(project => fetchProjectTasks(project._id)));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Update the Recent Tasks section
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects today.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button 
            onClick={() => handleCardClick('active')}
            className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <p className="text-2xl font-semibold mt-1">{projects.filter(project => project.status === 'active').length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => handleCardClick('completed')}
            className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Projects</p>
                <p className="text-2xl font-semibold mt-1">{projects.filter(project => project.status === 'completed').length}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => handleCardClick('due-soon')}
            className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Due Soon</p>
                <p className="text-2xl font-semibold mt-1">{dueSoonTasksCount}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Projects</h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow animate-pulse h-48"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow group">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <Link to={`/projects/${project._id}`}>
                      <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm('Are you sure you want to delete this project?')) {
                          deleteProject(project._id);
                        }
                      }} 
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'completed' ? 'bg-green-100 text-green-700' : project.status === 'archived' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 h-full text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <Plus className="h-10 w-10 mb-2" />
              <p className="font-medium">Create New Project</p>
            </button>
          </div>
        )}
        
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
            <Link 
              to="/"
              className="text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => {  // Removed slice(0, 5) to show all tasks
                  const projectName = projects.find(p => p._id === task.project)?.name || '';
                  
                  return (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{projectName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`
                        }>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'review' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'}`
                        }>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <Link 
                            to={`/projects/${task.project}`} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this task?')) {
                                handleDeleteTask(task._id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Layout>
  );
};

export default Dashboard;