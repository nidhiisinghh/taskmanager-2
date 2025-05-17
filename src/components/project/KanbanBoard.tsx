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
import { Trash2 } from 'lucide-react';

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
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { updateTask, fetchProjectTasks, deleteTask } = useTaskStore();
  
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
    return tasks
      .filter(task => task.status === statusId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };
  
  const handleStatusUpdate = async (taskId: string, newStatusId: string) => {
    try {
      setUpdateError(null);
      await updateTask(taskId, { status: newStatusId });
    } catch (error) {
      setUpdateError('Failed to update task status');
      console.error('Error updating task status:', error);
    }
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeTask = tasks.find(t => t._id === active.id); // Change _id to id
    if (!activeTask) return;
    
    const overId = over.id as string;
    const status = overId as 'todo' | 'in-progress' | 'review' | 'completed';
    
    if (status !== activeTask.status) {
      try {
        await updateTask(activeTask._id, { status }); // Change _id to id
        await fetchProjectTasks(projectId);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeTask = tasks.find(t => t._id === active.id);
    if (!activeTask) return;
    
    const overId = over.id as string;
    if (overId !== activeTask.status) {
      await handleStatusUpdate(activeTask._id, overId);
    }
    
    setActiveId(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        await fetchProjectTasks(projectId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[calc(100vh-200px)] p-4">
        <SortableContext items={statuses.map(s => s.id)} strategy={rectSortingStrategy}>
          {statuses.map(status => (
            <KanbanColumn
              key={status.id}
              status={status}
              tasks={getTasksByStatus(status.id)}
              projectId={projectId}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </SortableContext>
      </div>
      
      <DragOverlay>
        {activeId ? (
          <KanbanTask 
            task={tasks.find(t => t._id === activeId)!} 
            onDelete={() => handleDeleteTask(activeId)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;