import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Status, Task } from '../../types';
import KanbanTask from './KanbanTask';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
}

const KanbanColumn = ({ status, tasks }: KanbanColumnProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: status.id,
    data: {
      type: 'column',
      status,
    },
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0 w-[280px] bg-gray-50 rounded-lg flex flex-col"
      {...attributes}
      {...listeners}
    >
      <div className="p-3 text-sm font-medium flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: status.color }}
          />
          <span>{status.name}</span>
          <span className="text-gray-500 text-xs ml-1">{tasks.length}</span>
        </div>
        <button className="p-1 rounded hover:bg-gray-200 text-gray-500">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
        {tasks.map((task) => (
          <KanbanTask key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <div className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;