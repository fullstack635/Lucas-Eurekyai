import { TaskList } from "@/components/TaskList";
import { AddTask } from "@/components/AddTask";

export const TareasSection = () => {
  return (
    <>
      {/* Header */}
      <h1 className="text-[32px] lg:text-[48px] font-bold mb-8 px-4 lg:px-0">Tareas</h1>

      {/* All Tasks Section - Fetches all tasks from backend */}
      <TaskList />

      {/* Add Task */}
      <AddTask />
    </>
  );
};

