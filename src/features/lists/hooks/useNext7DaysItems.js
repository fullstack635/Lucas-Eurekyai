import { useMemo } from 'react';
import { useAllUserItems } from './useListItemsQuery';


export const useNext7DaysItems = (startFromMonday = false) => {
  const { data: allItems = [], isLoading, isError, error } = useAllUserItems({
    isCompleted: false,
    limit: 500,
  });

  const organizedData = useMemo(() => {
    if (!allItems || allItems.length === 0) {
      return { days: [], stats: { total: 0, completed: 0, pending: 0 } };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let startDate;
    if (startFromMonday) {
      const dayOfWeek = now.getDay(); 
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(now);
      startDate.setDate(now.getDate() - daysFromMonday);
    } else {
      startDate = new Date(now);
    }

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);

      days.push({
        date: currentDate.toISOString(),
        dayOfWeek: currentDate.getDay(),
        items: []
      });
    }

    allItems.forEach(item => {
      if (!item.scheduledAt) return;

      const itemDate = new Date(item.scheduledAt);
      itemDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < days.length; i++) {
        const dayDate = new Date(days[i].date);
        dayDate.setHours(0, 0, 0, 0);
        
        const nextDayDate = new Date(dayDate);
        nextDayDate.setDate(dayDate.getDate() + 1);

        if (itemDate >= dayDate && itemDate < nextDayDate) {
          days[i].items.push({
            ...item,
            isOverdue: new Date(item.scheduledAt) < new Date() && !item.isCompleted
          });
          break;
        }
      }
    });

    days.forEach(day => {
      day.items.sort((a, b) => {
        return new Date(a.scheduledAt) - new Date(b.scheduledAt);
      });
    });

    const totalItems = days.reduce((acc, day) => acc + day.items.length, 0);
    const completedItems = days.reduce(
      (acc, day) => acc + day.items.filter(item => item.isCompleted).length, 
      0
    );
    const pendingItems = totalItems - completedItems;

    return {
      days,
      stats: {
        total: totalItems,
        completed: completedItems,
        pending: pendingItems
      }
    };
  }, [allItems, startFromMonday]);

  return {
    data: organizedData,
    isLoading,
    isError,
    error
  };
};
