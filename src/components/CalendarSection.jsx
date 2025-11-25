import { useState, useEffect } from "react";
import { ExternalLink, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { useGoogleCalendar } from "@/features/calendar/hooks/useGoogleCalendar";
import { useOutlookCalendar } from "@/features/calendar/hooks/useOutlookCalendar";
import { useICloudCalendar } from "@/features/calendar/hooks/useICloudCalendar";
import { useCalendars } from "@/features/calendar/hooks/useCalendars";
import { useAllCalendarEvents } from "@/features/calendar/hooks/useCalendarEvents";

export const CalendarSection = ({ events: propEvents }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const today = new Date();
  const dayName = today.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
  const dayNumber = today.getDate();

  // Hooks for calendar management
  const { 
    connectGoogleCalendar, 
    isConnecting: isConnectingGoogle, 
    error: googleError,
    connectionStatus 
  } = useGoogleCalendar();

  const {
    connectOutlookCalendar,
    isConnecting: isConnectingOutlook,
    error: outlookError
  } = useOutlookCalendar();

  const {
    connectICloudCalendar,
    isConnecting: isConnectingICloud,
    error: iCloudError
  } = useICloudCalendar();

  const isConnecting = isConnectingGoogle || isConnectingOutlook || isConnectingICloud;
  const oauthError = googleError || outlookError || iCloudError;

  // Fetch calendars from backend
  const { 
    data: calendarsData, 
    isLoading: isLoadingCalendars,
    error: calendarsError 
  } = useCalendars({ 
    isActive: true, 
    syncEnabled: true,
    limit: 20,
    offset: 0
  });

  // Fetch events from all calendars
  const { 
    data: eventsData, 
    isLoading: isLoadingEvents 
  } = useAllCalendarEvents({
    dateRange: {
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    }
  });

  // Get active calendars
  const calendars = calendarsData?.data?.calendars || calendarsData?.calendars || [];
  const activeCalendars = calendars.filter(cal => cal.isActive && cal.syncEnabled);
  const isCalendarConnected = activeCalendars.length > 0;

  // Use events from API or fallback to prop events
  const events = eventsData?.data?.events || eventsData?.events || propEvents || [];

  // Format events for display
  const formattedEvents = events.map(event => {
    const startTime = event.start ? new Date(event.start) : null;
    const endTime = event.end ? new Date(event.end) : null;
    
    let timeString = '';
    if (startTime && endTime) {
      const startHour = startTime.getHours().toString().padStart(2, '0');
      const startMin = startTime.getMinutes().toString().padStart(2, '0');
      const endHour = endTime.getHours().toString().padStart(2, '0');
      const endMin = endTime.getMinutes().toString().padStart(2, '0');
      timeString = `${startHour}:${startMin}-${endHour}:${endMin}`;
    }

    return {
      time: timeString,
      title: event.summary || event.title || 'Sin título',
      badge: event.meetLink ? 'Únirse' : null,
      meetLink: event.meetLink
    };
  });

  const handleConnectGoogleCalendar = () => {
    connectGoogleCalendar();
    setPopoverOpen(false);
  };

  const handleConnectOutlookCalendar = () => {
    connectOutlookCalendar();
    setPopoverOpen(false);
  };

  const handleConnectICloudCalendar = () => {
    connectICloudCalendar();
    setPopoverOpen(false);
  };

  return (
    <section className="mb-8 px-4 lg:px-0">
      <h2 className="lg:text-[20px] text-[16px] font-semibold mb-4">Calendario</h2>
      
      {isLoadingCalendars ? (
        <div className="bg-card rounded-lg p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Cargando calendarios...</span>
          </div>
        </div>
      ) : !isCalendarConnected ? (
        <div className="bg-card rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <span className="text-3xs font-bold text-muted-foreground">{dayName}</span>
              <span className="text-3xl font-bold">{dayNumber}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm mb-2">No tienes calendarios sincronizados</p>
              {oauthError && (
                <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">{oauthError}</p>
                </div>
              )}
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="link" 
                    className="text-primary text-[#8465FF] p-0 h-auto hover:no-underline"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                        Conectando...
                      </>
                    ) : (
                      "Conectar calendario"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 mt-10" align="start">
                  <div className="p-1 bg-sidebar">
                    <button
                      onClick={handleConnectGoogleCalendar}
                      disabled={isConnecting}
                      className="hover:bg-[#6A52CC] pt-3 pb-3 pl-4 w-full flex items-center justify-between px-2 py-1.5 text-md rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                    >
                      <span>Google Calendar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleConnectOutlookCalendar}
                      disabled={isConnecting}
                      className="hover:bg-[#6A52CC] pt-3 pb-3 pl-4 w-full flex items-center justify-between px-2 py-1.5 text-md rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                    >
                      <span>Outlook Calendar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleConnectICloudCalendar}
                      disabled={isConnecting}
                      className="hover:bg-[#6A52CC] pt-3 pb-3 pl-4 w-full flex items-center justify-between px-2 py-1.5 text-md rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                    >
                      <span>iCloud Calendar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </PopoverContent>



              </Popover>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex flex-col items-center">
              <span className="text-3xs font-bold text-muted-foreground">{dayName}</span>
              <span className="text-3xl font-bold">{dayNumber}</span>
            </div>
            <div className="flex-1">
              <div className="mb-3">
                <span className="text-sm font-medium">
                  {activeCalendars.length === 1 
                    ? activeCalendars[0].calendarName || 'Mi calendario'
                    : `${activeCalendars.length} calendarios conectados`}
                </span>
              </div>
              {isLoadingEvents ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Cargando eventos...</span>
                </div>
              ) : formattedEvents.length > 0 ? (
                <div className="space-y-2">
                  {formattedEvents.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground min-w-[80px]">{event.time}</span>
                      <span className="text-sm">{event.title}</span>
                      {event.badge && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 bg-[#8465FF] text-[#FFFFFF]"
                          onClick={() => event.meetLink && window.open(event.meetLink, '_blank')}
                        >
                          {event.badge}
                        </Button>
                      )}
                      {event.meetLink && (
                        <ExternalLink 
                          className="w-4 h-4 text-primary ml-auto cursor-pointer hover:opacity-80" 
                          onClick={() => window.open(event.meetLink, '_blank')}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay eventos programados para hoy</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
