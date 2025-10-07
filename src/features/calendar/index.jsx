import { useState, useEffect } from 'react';
import { RefreshCw, Settings as SettingsIcon, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendars } from './hooks/useCalendars';
import { useGoogleCalendar } from './hooks/useGoogleCalendar';
import CalendarView from './components/CalendarView';
import CalendarSettings from './components/CalendarSettings';
import Button from '../../shared/components/ui/Button';

const Calendar = () => {
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [events, setEvents] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  // Fetch calendars
  const { data: calendarsData, isLoading, error, refetch } = useCalendars({
    isActive: true,
    syncEnabled: true,
  });

  const { syncAllCalendars, isSyncing } = useGoogleCalendar();

  const calendars = calendarsData?.data || [];
  const hasCalendars = calendars.length > 0;

  // Set the first calendar as selected by default
  useEffect(() => {
    if (calendars.length > 0 && !selectedCalendar) {
      const primary = calendars.find(cal => cal.isPrimary) || calendars[0];
      setSelectedCalendar(primary);
    }
  }, [calendars, selectedCalendar]);

  // Mock events - In a real implementation, you would fetch these from the backend
  // based on the selected calendar
  useEffect(() => {
    if (selectedCalendar) {
      // TODO: Fetch events from backend for the selected calendar
      // For now, using empty array
      setEvents([]);
    }
  }, [selectedCalendar]);

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
        {selectedCalendar ? (
          <CalendarView
            events={events}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecciona un calendario</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
