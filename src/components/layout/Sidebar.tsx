import { Link, useLocation } from 'react-router-dom';
import { 
  Layers, Home, Folder, Settings, 
  Users, Bell, PlusCircle
} from 'lucide-react';
import useProjectStore from '../../store/projectStore';

const Sidebar = () => {
  const location = useLocation();
  const { projects } = useProjectStore();
  
  // Limit displayed projects
  const displayedProjects = projects.slice(0, 5);
  const hasMoreProjects = projects.length > 5;
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
          <PlusCircle className="h-5 w-5" />
          <span>New Project</span>
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              isActivePath('/') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/notifications" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              isActivePath('/notifications') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </Link>
          
          <Link 
            to="/team" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              isActivePath('/team') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Team</span>
          </Link>
        </div>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Projects
          </h3>
          <div className="mt-2 space-y-1">
            {displayedProjects.map((project) => (
              <Link 
                key={project.id}
                to={`/projects/${project.id}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActivePath(`/projects/${project.id}`) 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Folder className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{project.title}</span>
              </Link>
            ))}
            
            {hasMoreProjects && (
              <Link 
                to="/projects"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="text-blue-500">View all projects</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link 
          to="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;