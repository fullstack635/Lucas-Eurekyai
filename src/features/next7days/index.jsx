import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNext7DaysItems } from '../lists/hooks/useNext7DaysItems';
import DayColumn from './components/DayColumn';

const Next7Days = () => {
  const { t } = useTranslation();
  const [startFromMonday] = useState(true);
  const { data: weekData, isLoading } = useNext7DaysItems(startFromMonday);

  const getDayNames = () => {
    return [
      { key: 'monday', label: t('next7Days.monday') },
      { key: 'tuesday', label: t('next7Days.tuesday') },
      { key: 'wednesday', label: t('next7Days.wednesday') },
      { key: 'thursday', label: t('next7Days.thursday') },
      { key: 'friday', label: t('next7Days.friday') },
      { key: 'saturday', label: t('next7Days.saturday') },
      { key: 'sunday', label: t('next7Days.sunday') },
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const dayNames = getDayNames();
  const days = weekData?.days || [];

  return (
    <div className="px-4 lg:px-6">
      <h1 className="text-[32px] lg:text-[48px] font-bold mb-6">{t('next7Days.title')}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {dayNames.map((day, index) => {
          const dayData = days[index] || { items: [] };
          return (
            <DayColumn
              key={day.key}
              dayName={day.label}
              items={dayData.items || []}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Next7Days;
