import { useState, useMemo } from 'react';
import { useNext7DaysItems } from '../../lists/hooks/useNext7DaysItems';
import DayColumn from '../../next7days/components/DayColumn';
import { TaskNotifications } from '../../next7days/components/TaskNotifications';

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

  const allItems = useMemo(() => {
    if (!weekData?.days) return [];
    return weekData.days.flatMap(day => day.items || []);
  }, [weekData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const days = weekData?.days || [];

  return (
    <>
      <div className="px-6 py-4">
        <h1 className="text-[20px] font-semibold mb-3">Próximos 7 días</h1>

        <div className="flex flex-col gap-6 md:flex-row md:gap-4">
          {days.map((dayData, index) => {
            const isToday = index === 0;
            return (
              <DayColumn
                key={`day-${index}`}
                dayName={getDayNameByNumber(dayData.dayOfWeek)}
                date={dayData.date}
                items={dayData.items || []}
                isToday={isToday}
              />
            );
          })}
        </div>
      </div>

      <TaskNotifications items={allItems} />
    </>
  );
};
