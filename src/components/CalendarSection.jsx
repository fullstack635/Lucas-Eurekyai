import { useState } from "react";
import { ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const calendarOptions = [
  "Google Calendar",
  "Outlook Calendar",
  "iCloud Calendar",
];

export const CalendarSection = ({ events }) => {
  const [connectedCalendar, setConnectedCalendar] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const today = new Date();
  const dayName = today.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
  const dayNumber = today.getDate();

  const handleCalendarSelect = (calendar) => {
    setConnectedCalendar(calendar);
    setPopoverOpen(false);
  };

  const isCalendarConnected = connectedCalendar !== null;

  return (
    <section className="mb-8 px-4 lg:px-0">
      <h2 className="lg:text-[20px] text-[16px] font-semibold mb-4">Calendario</h2>
      
      {!isCalendarConnected ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">{dayName}</span>
              <span className="text-3xl font-bold">{dayNumber}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm mb-2">No tienes calendarios sincronizados</p>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="link" className="text-primary text-[#8465FF] p-0 h-auto hover:no-underline">
                    Conectar calendario
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 mt-7" align="start">
                  <div className="p-1 bg-[#0F1521]">
                    {calendarOptions.map((calendar) => (
                      <button
                        key={calendar}
                        onClick={() => handleCalendarSelect(calendar)}
                        className="hover:bg-[#6A52CC] pt-3 pb-3 pl-4 w-full flex items-center justify-between px-2 py-1.5 text-md rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <span>{calendar}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border-2 border-primary rounded-lg p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">{dayName}</span>
              <span className="text-3xl font-bold">{dayNumber}</span>
            </div>
            <div className="flex-1">
              <div className="mb-3">
                <span className="text-sm font-medium">{connectedCalendar}</span>
              </div>
              {events.length > 0 ? (
                <div className="space-y-2">
                  {events.map((event, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground min-w-[80px]">{event.time}</span>
                    <span className="text-sm">{event.title}</span>
                    {event.badge && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                      >
                        {event.badge}
                      </Button>
                    )}
                    {idx === 0 && (
                      <ExternalLink className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay eventos programados</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
