import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import KanbanBoard from '../components/project/KanbanBoard';
import { mockProjects, mockTasks } from '../utils/mockData';
import useProjectStore from '../store/projectStore';
import useTaskStore from '../store/taskStore';
import { 
  Plus, Users, Calendar, Settings, 
  MoreHorizontal
} from 'lucide-react';

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { setCurrentProject } = useProjectStore();
  const { setTasks } = useTaskStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board');
  
  // Load project and tasks data
  useEffect(() => {
    if (!projectId) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const project = mockProjects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
        const projectTasks = mockTasks.filter(t => t.projectId === projectId);
        setTasks(projectTasks);
      }
      setIsLoading(false);
    }, 500);
  }, [projectId, setCurrentProject, setTasks]);
  
  // Get current project from store
  const { currentProject } = useProjectStore();
  const { tasks } = useTaskStore();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }
  
  if (!currentProject) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentProject.title}
              </h1>
              <p className="text-gray-600 mt-1 max-w-2xl">
                {currentProject.description}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Users className="h-4 w-4" />
                <span>Invite</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'board'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'list'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'calendar'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'automation'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Automation
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>
        </header>
        
        {activeTab === 'board' && (
          <KanbanBoard 
            tasks={tasks} 
            statuses={currentProject.statuses} 
          />
        )}
        
        {activeTab === 'list' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
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
                {tasks.map((task) => {
                  const statusName = currentProject.statuses.find(s => s.id === task.statusId)?.name || '';
                  
                  return (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {statusName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {task.assigneeId ? 'Assigned' : 'Unassigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-800">Calendar View</h3>
                <p className="text-gray-500 mt-1">
                  Coming soon! Track your tasks in a calendar view.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'automation' && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-800">Workflow Automations</h2>
              <button className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
                <Plus className="h-4 w-4" />
                <span>Create Automation</span>
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">When a task is moved to 'Done'</h3>
                  <p className="text-sm text-gray-500 mt-1">Assign a 'Completed Task' badge to the assignee</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">When a task is assigned</h3>
                  <p className="text-sm text-gray-500 mt-1">Move it to 'In Progress' status</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">When a due date passes</h3>
                  <p className="text-sm text-gray-500 mt-1">Send a notification to assignee and project owner</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-800">Project Settings</h2>
              <button className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
                <Settings className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  defaultValue={currentProject.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  defaultValue={currentProject.description}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Board Statuses
                </label>
                <div className="space-y-3">
                  {currentProject.statuses.map((status) => (
                    <div key={status.id} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <input
                        type="text"
                        defaultValue={status.name}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Status</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Members
                </label>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">JD</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Owner</div>
                  </div>
                  
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium">AS</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Alice Smith</p>
                        <p className="text-xs text-gray-500">alice@example.com</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Member</div>
                  </div>
                </div>
                
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-3">
                  <Plus className="h-4 w-4" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetail;