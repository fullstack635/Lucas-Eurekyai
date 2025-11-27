import { useNext7DaysItems } from '../../lists/hooks/useNext7DaysItems';
import DayColumn from '../../next7days/components/DayColumn';

export const Proximos7Section = () => {
  const { data: weekData, isLoading } = useNext7DaysItems();

  const getDayNameByNumber = (dayOfWeek) => {
    const dayNames = {
      0: 'Domingo',
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
    };
    return dayNames[dayOfWeek] || '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const days = weekData?.days || [];

  return (
    <div className="flex flex-col h-full">
      <h1
        className="px-4 lg:px-6 mb-4 flex-shrink-0"
        style={{
          fontFamily: 'DM Sans',
          fontWeight: '400',
          fontSize: '20px',
          lineHeight: '150%',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'lining-nums tabular-nums'
        }}
      >Próximos 7 días</h1>

      <div className="lg:hidden flex flex-col gap-4 px-4 overflow-y-auto">
        {days.map((dayData, index) => {
          const isToday = index === 0;
          return (
            <div key={`day-mobile-${index}`} className="w-full">
              <DayColumn
                dayName={getDayNameByNumber(dayData.dayOfWeek)}
                date={dayData.date}
                items={dayData.items || []}
                isToday={isToday}
              />
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block flex-1 overflow-x-auto overflow-y-visible pb-4 custom-scrollbar">
        <div className="flex gap-4 px-6">
          {days.map((dayData, index) => {
            const isToday = index === 0;
            return (
              <div key={`day-${index}`} className="flex-shrink-0 w-[280px]">
                <DayColumn
                  dayName={getDayNameByNumber(dayData.dayOfWeek)}
                  date={dayData.date}
                  items={dayData.items || []}
                  isToday={isToday}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
