import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { 
  Calendar, MessageSquare, 
  MoreHorizontal, User 
} from 'lucide-react';
import { format } from 'date-fns';
import useTaskStore from '../../store/taskStore';

interface KanbanTaskProps {
  task: Task;
  onDelete: () => void;
}

const KanbanTask = ({ task }: KanbanTaskProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { deleteTask } = useTaskStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,  // Fixed: changed _id to id
    data: {
      type: 'task',
      task,
    },
  });
  
  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    willChange: 'transform',
    opacity: isDragging ? 0.5 : 1,
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);  // Fixed: changed _id to id
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 cursor-grab active:cursor-grabbing relative"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800">{task.title}</h3>
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 focus:outline-none"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          
          {isMenuOpen && (
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            >
              <div 
                className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    // Add edit functionality
                    setIsMenuOpen(false);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href + `?task=${task.id}`);
                    setIsMenuOpen(false);
                  }}
                >
                  Copy link
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
          
          {task.comments?.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>
        
        {task.assigneeId && (  // Fixed: changed assignee to assigneeId
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="h-3 w-3 text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanTask;