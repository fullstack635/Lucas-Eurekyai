import { MoreVertical } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const TaskList = ({ tasks, onToggleTask, onDeleteTask, onEditTask }) => {
  return (
    <section className="mb-8 px-4 lg:px-0">
      <h2 className="lg:text-[20px] text-[16px] font-semibold mb-4">Tareas</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-card rounded-lg p-4 flex items-center gap-3 hover:border-primary transition-colors"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleTask(task.id)}
              className="border-muted-foreground border-[#000000]"
            />
            <div className="flex-1">
              <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                MIS LISTAS • {task.list.toUpperCase()}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border border-border bg-sidebar">
                <DropdownMenuItem onClick={() => onEditTask(task.id)} className="p-3 hover:bg-[#6A52CC] hover:text-accent-foreground border-b border-border">
                  Lista
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditTask(task.id)} className="p-3 hover:bg-[#6A52CC] hover:text-accent-foreground border-b border-border">
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteTask(task.id)}
                  className="text-destructive p-3 hover:bg-[#6A52CC] hover:text-accent-foreground"
                >
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </section>
  );
};
