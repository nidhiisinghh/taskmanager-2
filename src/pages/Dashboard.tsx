import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { 
  Plus, Calendar, CheckCircle, Clock, 
  AlertCircle, MoreHorizontal, Folder 
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useProjectStore from '../store/projectStore';
import { format } from 'date-fns';

// Mock data for initial rendering
import { mockProjects, mockTasks } from '../utils/mockData';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { projects, setProjects } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Load mock data for demo
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 500);
  }, [setProjects]);
  
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
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <p className="text-2xl font-semibold mt-1">{projects.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                <p className="text-2xl font-semibold mt-1">12</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Due Soon</p>
                <p className="text-2xl font-semibold mt-1">5</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
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
              <Link 
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{project.description}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.statuses.map((status) => (
                      <span 
                        key={status.id}
                        className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                      >
                        {status.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 flex justify-between">
                  <div>
                    <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{project.members.length} members</span>
                  </div>
                </div>
              </Link>
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
                    Due Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockTasks.map((task) => {
                  const projectName = projects.find(p => p.id === task.projectId)?.title || '';
                  const statusName = projects
                    .find(p => p.id === task.projectId)
                    ?.statuses.find(s => s.id === task.statusId)?.name || '';
                  
                  return (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{projectName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {statusName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;