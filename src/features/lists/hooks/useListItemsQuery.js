import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listItemsService } from '../../../shared/services/listItems';
import { useNotifications } from '../../../shared/contexts/AppContext';

// Query keys for list items
export const listItemsKeys = {
  all: ['listItems'],
  lists: () => [...listItemsKeys.all, 'list'],
  list: (listId, filters) => [...listItemsKeys.lists(), listId, { filters }],
  allUserItems: (filters) => [...listItemsKeys.all, 'allUserItems', { filters }],
};

// Hook to get all items across all lists
export const useAllUserItems = (filters = {}) => {
  return useQuery({
    queryKey: listItemsKeys.allUserItems(filters),
    queryFn: () => listItemsService.getAllUserItems(filters),
    select: (response) => response.data?.items || [],
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to get all items for a specific list
export const useListItems = (listId, filters = {}) => {
  return useQuery({
    queryKey: listItemsKeys.list(listId, filters),
    queryFn: () => listItemsService.getListItems(listId, filters),
    select: (response) => response.data?.items || [], // Extract items array from response
    enabled: !!listId, // Only run query if listId is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to add a new item to a list
export const useAddItemToList = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ listId, itemData }) => listItemsService.addItemToList(listId, itemData),
    onSuccess: (response, variables) => {
      // Invalidate and refetch list items for the specific list
      queryClient.invalidateQueries({
        queryKey: listItemsKeys.list(variables.listId)
      });

      // Add success notification
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Item agregado exitosamente',
      });
    },
    onError: (error) => {
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al agregar el item',
      });
    },
  });
};

// Hook to add a new item to default list
export const useAddItemToDefaultList = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (itemData) => listItemsService.addItemToDefaultList(itemData),
    onSuccess: (response) => {
      // Invalidate all list items queries to refresh data
      queryClient.invalidateQueries({ queryKey: listItemsKeys.all });

      // Add success notification
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Item agregado a la lista por defecto exitosamente',
      });
    },
    onError: (error) => {
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al agregar el item a la lista por defecto',
      });
    },
  });
};

// Hook to update an item
export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ id, ...updates }) => listItemsService.updateItem(id, updates),
    onSuccess: (response, variables) => {
      // Invalidate all list items queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: listItemsKeys.lists() });
      
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Item actualizado exitosamente',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al actualizar el item',
      });
    },
  });
};

// Hook to toggle item completion
export const useToggleItemCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => listItemsService.toggleItemCompletion(itemId),
    onMutate: async (itemId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listItemsKeys.lists() });

      // Snapshot the previous value
      const previousData = queryClient.getQueriesData({ queryKey: listItemsKeys.lists() });

      // Optimistically update the cache
      queryClient.setQueriesData({ queryKey: listItemsKeys.lists() }, (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(item =>
          item.id === itemId
            ? { ...item, isCompleted: !item.isCompleted }
            : item
        );
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: listItemsKeys.lists() });
    },
  });
};

// Hook to delete an item
export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (itemId) => listItemsService.deleteItem(itemId),
    onSuccess: (response, deletedId) => {
      // Remove the item from all relevant caches optimistically
      queryClient.setQueriesData({ queryKey: listItemsKeys.lists() }, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(item => item.id !== deletedId);
      });
      
      addNotification({
        type: 'success',
        title: 'Éxito',
        message: response.message || 'Item eliminado exitosamente',
      });
    },
    onError: (error) => {
      // Invalidate to restore the cache in case of error
      queryClient.invalidateQueries({ queryKey: listItemsKeys.lists() });
      
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al eliminar el item',
      });
    },
  });
};

// Combined hook for all list item operations
export const useListItemsOperations = (listId) => {
  const itemsQuery = useListItems(listId);
  const addItemMutation = useAddItemToList();
  const updateItemMutation = useUpdateItem();
  const toggleMutation = useToggleItemCompletion();
  const deleteMutation = useDeleteItem();

  return {
    // Data
    items: itemsQuery.data || [],
    isLoading: itemsQuery.isLoading,
    isError: itemsQuery.isError,
    error: itemsQuery.error,
    
    // Operations
    addItem: (itemData) => addItemMutation.mutate({ listId, itemData }),
    updateItem: updateItemMutation.mutate,
    toggleCompletion: toggleMutation.mutate,
    deleteItem: deleteMutation.mutate,
    
    // Loading states
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};