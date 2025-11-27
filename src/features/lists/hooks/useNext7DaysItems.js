import { useMemo } from 'react';
import { useAllUserItems } from './useListItemsQuery';


export const useNext7DaysItems = (startFromMonday = false) => {
  const { data: allItems = [], isLoading, isError, error } = useAllUserItems({
    limit: 500,
  });


  console.log('allItems recibidos en useNext7DaysItems:', allItems.length, allItems);
  const organizedData = useMemo(() => {
    console.log('Recalculando organizedData con', allItems.length, 'items');
    if (!allItems || allItems.length === 0) {
      return { days: [], stats: { total: 0, completed: 0, pending: 0 } };
    }

    const now = new Date();

    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

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

      console.log('Procesando item:', item.content, 'scheduledAt:', item.scheduledAt, 'itemDate normalizado:', itemDate);

      for (let i = 0; i < days.length; i++) {
        const dayDate = new Date(days[i].date);
        dayDate.setHours(0, 0, 0, 0);

        const nextDayDate = new Date(dayDate);
        nextDayDate.setDate(dayDate.getDate() + 1);

        if (itemDate >= dayDate && itemDate < nextDayDate) {
          console.log('✅ Item asignado al día', i, 'dayDate:', dayDate);
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
        // Las tareas completadas van al final
        if (a.isCompleted && !b.isCompleted) return 1;
        if (!a.isCompleted && b.isCompleted) return -1;

        // Para tareas no completadas, ordenar por updatedAt (más reciente primero)
        if (!a.isCompleted && !b.isCompleted) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        }

        // Para tareas completadas, mantener orden por scheduledAt
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
