import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  closestCorners,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../store/taskStore';
import KanbanColumn from './KanbanColumn';
import KanbanTask from './KanbanTask';
import useTaskStore from '../../store/taskStore';

const statuses = [
  { id: 'todo', name: 'To Do', color: '#3B82F6', order: 0 },
  { id: 'in-progress', name: 'In Progress', color: '#EAB308', order: 1 },
  { id: 'review', name: 'Review', color: '#A855F7', order: 2 },
  { id: 'completed', name: 'Completed', color: '#22C55E', order: 3 },
];

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
}

const KanbanBoard = ({ tasks, projectId }: KanbanBoardProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null); // Add this line
  const { updateTask, fetchProjectTasks } = useTaskStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const getTasksByStatus = (statusId: string) => {
    return tasks.filter(task => task.statusId === statusId);
  };
  
  const handleStatusUpdate = async (taskId: string, newStatusId: string) => {
    try {
      setUpdateError(null);
      await updateTask(taskId, { statusId: newStatusId });
    } catch (error) {
      setUpdateError('Failed to update task status');
      console.error('Error updating task status:', error);
    }
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeTask = tasks.find(t => t.id === active.id); // Change _id to id
    if (!activeTask) return;
    
    const overId = over.id as string;
    const status = overId as 'todo' | 'in-progress' | 'review' | 'completed';
    
    if (status !== activeTask.status) {
      try {
        await updateTask(activeTask.id, { status }); // Change _id to id
        await fetchProjectTasks(projectId);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;
    
    const overId = over.id as string;
    if (overId !== activeTask.statusId) {
      await handleStatusUpdate(activeTask.id, overId);
    }
    
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        <SortableContext items={statuses.map(s => s.id)} strategy={rectSortingStrategy}>
          {statuses.map(status => (
            <KanbanColumn
              key={status.id}
              status={status}
              tasks={getTasksByStatus(status.id)}
              projectId={projectId}
            />
          ))}
        </SortableContext>
      </div>
      
      <DragOverlay>
        {activeId ? (
          <KanbanTask task={tasks.find(t => t.id === activeId)!} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;