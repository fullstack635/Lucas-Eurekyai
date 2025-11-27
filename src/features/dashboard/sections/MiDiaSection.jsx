import { CalendarSection } from "@/components/CalendarSection";
import { TaskList } from "@/components/TaskList";
import { AddTask } from "@/components/AddTask";

export const MiDiaSection = ({ calendarEvents }) => {
  return (
    <>
      {/* Welcome Message */}
      <h1 className="text-[32px] lg:text-[48px] font-bold mt-16 mb-8 px-4 lg:px-0">Buenos días, Roger</h1>

      {/* Calendar Section */}
      <CalendarSection events={calendarEvents} />

      {/* Tasks Section - Fetches all tasks from backend */}
      <TaskList />

      {/* Add Task */}
      <AddTask />
    </>
  );
};

