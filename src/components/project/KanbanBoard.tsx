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
import { Status, Task } from '../../types';
import KanbanColumn from './KanbanColumn';
import KanbanTask from './KanbanTask';
import useTaskStore from '../../store/taskStore';

interface KanbanBoardProps {
  tasks: Task[];
  statuses: Status[];
}

const KanbanBoard = ({ tasks, statuses }: KanbanBoardProps) => {
  const { updateTask } = useTaskStore();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Helper functions
  const getTasksByStatus = (statusId: string) => {
    return tasks.filter(task => task.statusId === statusId);
  };
  
  const getActiveTask = () => {
    if (!activeTaskId) return null;
    return tasks.find(task => task.id === activeTaskId) || null;
  };
  
  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTaskId(active.id as string);
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeTaskId = active.id as string;
    const overId = over.id as string;
    
    // Check if the active item is being dragged over a different container
    const activeTask = tasks.find(task => task.id === activeTaskId);
    const overStatus = statuses.find(status => status.id === overId);
    
    if (!activeTask || !overStatus) return;
    
    // If the task is already in this status column, we don't need to do anything
    if (activeTask.statusId === overStatus.id) return;
    
    // Update task status
    const updatedTask = {
      ...activeTask,
      statusId: overStatus.id,
      updatedAt: new Date().toISOString(),
    };
    
    updateTask(updatedTask);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskId(null);
  };
  
  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[calc(100vh-250px)]">
        {sortedStatuses.map((status) => (
          <KanbanColumn 
            key={status.id}
            status={status}
            tasks={getTasksByStatus(status.id)}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeTaskId ? (
          <div className="w-[280px] opacity-80">
            <KanbanTask task={getActiveTask()!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;