import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNext7DaysItems } from '../lists/hooks/useNext7DaysItems';
import DayColumn from './components/DayColumn';

const Next7Days = () => {
  const { t } = useTranslation();
  const { data: weekData, isLoading } = useNext7DaysItems();

  const getDayNameByNumber = (dayOfWeek) => {
    const dayNames = {
      0: t('next7Days.sunday'),
      1: t('next7Days.monday'),
      2: t('next7Days.tuesday'),
      3: t('next7Days.wednesday'),
      4: t('next7Days.thursday'),
      5: t('next7Days.friday'),
      6: t('next7Days.saturday'),
    };
    return dayNames[dayOfWeek] || '';
  };

  const days = weekData?.days || [];

  return (
    <div className="px-4 lg:px-6 pb-6">
      <h1 className="text-[32px] lg:text-[48px] font-bold mb-6">{t('next7Days.title')}</h1>

      <div className="overflow-x-auto pb-2 -mx-4 lg:-mx-6 px-4 lg:px-6">
        <div className="flex gap-4">
          {days.map((dayData, index) => {
            const isToday = index === 0;
            return (
              <div key={`day-${index}`} className="flex-shrink-0 w-[280px]">
                <DayColumn
                  dayName={getDayNameByNumber(dayData.dayOfWeek)}
                  items={dayData.items || []}
                  date={dayData.date}
                  isLoading={isLoading}
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

export default Next7Days;
