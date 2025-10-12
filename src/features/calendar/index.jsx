import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Settings as SettingsIcon, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendars } from './hooks/useCalendars';
import { useGoogleCalendar } from './hooks/useGoogleCalendar';
import { useAllCalendarEvents } from './hooks/useCalendarEvents';
import CalendarView from './components/CalendarView';
import CalendarSettings from './components/CalendarSettings';
import Button from '../../shared/components/ui/Button';
import { startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

const Calendar = () => {
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: subMonths(startOfMonth(new Date()), 1),
    end: addMonths(endOfMonth(new Date()), 1),
  });

  // Fetch calendars
  const { data: calendarsData, isLoading, error, refetch } = useCalendars({
    isActive: true,
    syncEnabled: true,
  });

  const { syncAllCalendars, isSyncing } = useGoogleCalendar();

  // Fetch events for all calendars
  const { data: eventsData, isLoading: isLoadingEvents } = useAllCalendarEvents({ dateRange });

  const calendars = calendarsData?.data?.calendars || [];
  const hasCalendars = calendars.length > 0;

  // Extract events from response
  const allEvents = useMemo(() => {
    return eventsData?.data?.events || [];
  }, [eventsData]);

  console.log('Calendar index - calendarsData:', calendarsData);
  console.log('Calendar index - calendars:', calendars);
  console.log('Calendar index - selectedCalendar:', selectedCalendar);
  console.log('Calendar index - eventsData:', eventsData);
  console.log('Calendar index - allEvents:', allEvents);

  // Set the first calendar as selected by default
  useEffect(() => {
    if (calendars.length > 0 && !selectedCalendar) {
      const primary = calendars.find(cal => cal.isPrimary) || calendars[0];
      console.log('Setting selected calendar:', primary);
      setSelectedCalendar(primary);
    }
  }, [calendars, selectedCalendar]);

  const handleNavigate = (newDate) => {
    // Update date range when user navigates to different month
    const start = subMonths(startOfMonth(newDate), 1);
    const end = addMonths(endOfMonth(newDate), 1);
    setDateRange({ start, end });
  };

  const handleSync = () => {
    syncAllCalendars();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleSelectEvent = (event) => {
    console.log('Selected event:', event);
    // TODO: Open event details modal
  };

  const handleSelectSlot = (slotInfo) => {
    console.log('Selected slot:', slotInfo);
    // TODO: Open create event modal
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Cargando calendarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar calendarios: {error.message}</p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  // Show settings/connect screen if no calendars or settings is open
  if (!hasCalendars || showSettings) {
    return (
      <div className="h-full">
        {hasCalendars && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <Button variant="outline" onClick={toggleSettings}>
              ← Volver al Calendario
            </Button>
          </div>
        )}
        <CalendarSettings />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-6 h-6 text-gray-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
            <p className="text-sm text-gray-600">
              Administra tus eventos sincronizados con Google Calendar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedCalendar && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCalendar.backgroundColor || '#3b82f6' }}
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedCalendar.calendarName}
              </span>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`}
            />
            Sincronizar
          </Button>

          <Button variant="outline" onClick={toggleSettings}>
            <SettingsIcon className="w-4 h-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1 p-6 overflow-hidden">
        {isLoadingEvents ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Cargando eventos...</p>
            </div>
          </div>
        ) : (
          <CalendarView
            events={allEvents}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
