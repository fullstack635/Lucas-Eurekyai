import { CalendarSection } from "@/components/CalendarSection";
import { TaskList } from "@/components/TaskList";
import { AddTask } from "@/components/AddTask";

export const Proximos7Section = ({ calendarEvents }) => {
  // TODO: Filter tasks and events for the next 7 days
  return (
    <>
      {/* Header */}
      <h1 className="text-[32px] lg:text-[48px] font-bold mb-8 px-4 lg:px-0">Próximos 7 días</h1>

      {/* Calendar Section for next 7 days */}
      <CalendarSection events={calendarEvents} />

      {/* Tasks Section for next 7 days */}
      <TaskList />

      {/* Add Task */}
      <AddTask />
    </>
  );
};

