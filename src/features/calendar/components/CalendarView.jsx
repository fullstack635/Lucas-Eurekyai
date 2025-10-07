import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';

// Setup the localizer for react-big-calendar using date-fns
const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ events = [], onSelectEvent, onSelectSlot, onNavigate }) => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Transform events to the format react-big-calendar expects
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.summary || event.title || 'Untitled Event',
      start: new Date(event.start?.dateTime || event.start?.date || event.startTime),
      end: new Date(event.end?.dateTime || event.end?.date || event.endTime),
      allDay: !event.start?.dateTime, // If no dateTime, it's an all-day event
      resource: event,
    }));
  }, [events]);

  const handleSelectEvent = useCallback((event) => {
    if (onSelectEvent) {
      onSelectEvent(event.resource);
    }
  }, [onSelectEvent]);

  const handleSelectSlot = useCallback((slotInfo) => {
    if (onSelectSlot) {
      onSelectSlot(slotInfo);
    }
  }, [onSelectSlot]);

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
    if (onNavigate) {
      onNavigate(newDate);
    }
  }, [onNavigate]);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  // Custom event style getter
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#3b82f6',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block',
    };
    return { style };
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm p-6">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 200px)' }}
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day', 'agenda']}
        messages={{
          today: 'Hoy',
          previous: 'Anterior',
          next: 'Siguiente',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este rango.',
          showMore: (total) => `+ Ver más (${total})`,
        }}
        popup
      />
    </div>
  );
};

export default CalendarView;
