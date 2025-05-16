import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Status, Task } from '../../types';
import KanbanTask from './KanbanTask';
import { Plus } from 'lucide-react';
import CreateTaskModal from './CreateTaskModal';
import { useState } from 'react';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  projectId: string;
}

const KanbanColumn = ({ status, tasks, projectId }: KanbanColumnProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
      {...attributes}
      {...listeners}
      className="bg-gray-100 p-4 rounded-lg min-h-[200px] w-80"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">{status.name}</h3>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="text-gray-600 hover:text-blue-600"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <KanbanTask key={task.id} task={task} />
        ))}
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        initialStatus={status.id}
      />
    </div>
  );
};

export default KanbanColumn;