import { Plus } from 'lucide-react';
import { useToggleItemCompletion } from '../../lists/hooks/useListItemsQuery';
import { useState } from 'react';

const DayColumn = ({ dayName, items = [] }) => {
  const toggleCompletion = useToggleItemCompletion();
  const [newTaskText, setNewTaskText] = useState('');

  const handleToggle = async (itemId, e) => {
    e.stopPropagation();
    try {
      await toggleCompletion.mutateAsync(itemId);
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    // TODO: Implementar agregar tarea
    console.log('Agregar tarea:', newTaskText);
    setNewTaskText('');
  };

  return (
    <div className="flex flex-col">
      <div className="mb-3">
        <h3 className="text-[14px] font-medium text-foreground">{dayName}</h3>
      </div>

      <form onSubmit={handleAddTask} className="mb-3">
        <div className="relative flex items-center">
          <Plus className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Agregar tarea"
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-muted-foreground"
          />
        </div>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-start gap-2 py-1.5 cursor-pointer"
            onClick={(e) => handleToggle(item.id, e)}
          >
            <input
              type="checkbox"
              checked={item.isCompleted || false}
              onChange={() => {}}
              className="mt-0.5 rounded border-border text-primary-600 focus:ring-1 focus:ring-primary-500 cursor-pointer"
            />
            <span className={`text-[13px] flex-1 leading-relaxed ${
              item.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {item.content}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
