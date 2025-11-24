import { CalendarSection } from "@/components/CalendarSection";

export const CalendarioSectionView = ({ calendarEvents }) => {
  return (
    <>
      {/* Header */}
      <h1 className="text-[32px] lg:text-[48px] font-bold mb-8 px-4 lg:px-0">Mi calendario</h1>

      {/* Full Calendar Section */}
      <CalendarSection events={calendarEvents} />
    </>
  );
};

