import { Plus } from 'lucide-react';
import {
  useToggleItemCompletion,
  useAddItemToDefaultList,
  useDeleteItem,
  useUpdateItem,
  listItemsKeys,
} from '../../lists/hooks/useListItemsQuery';
import { useLists } from '../../lists/hooks/useListsQuery';
import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTaskItem } from './SortableTaskItem';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { motion, AnimatePresence } from 'framer-motion';
import { SubtasksModal } from './SubtasksModal';
import { EditTaskModal } from './EditTaskModal';
import { ChangeListModal } from './ChangeListModal';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const DayColumn = ({ dayName, items = [], date, isLoading = false, isToday = false }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toggleCompletion = useToggleItemCompletion();
  const addItemMutation = useAddItemToDefaultList();
  const deleteItemMutation = useDeleteItem();
  const updateItemMutation = useUpdateItem();
  const { data: lists = [] } = useLists();

  const [newTaskText, setNewTaskText] = useState('');
  const [isMobileComposerOpen, setMobileComposerOpen] = useState(false);
  const [selectedChip, setSelectedChip] = useState('hoy');
  const [editingItemId, setEditingItemId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedItemForSubtasks, setSelectedItemForSubtasks] = useState(null);
  const [selectedListId, setSelectedListId] = useState(null);
  const [showListSelector, setShowListSelector] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToChangeList, setItemToChangeList] = useState(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const handleReorder = (itemId, oldIndex, newIndex) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const now = new Date();
    now.setSeconds(now.getSeconds() + newIndex);

    updateItemMutation.mutate({
      id: itemId,
      content: item.content,
      priority: item.priority || 'medium',
      scheduledAt: now.toISOString()
    });
  };

  const { localItems, sensors, handleDragEnd } = useDragAndDrop(items, handleReorder);

  const [togglingItemId, setTogglingItemId] = useState(null);

  const handleToggle = async (itemId) => {
    setTogglingItemId(itemId);
    toggleCompletion.mutate(itemId, {
      onSettled: async () => {
        setTogglingItemId(null);
        setIsRefetching(true);
        await queryClient.invalidateQueries({
          queryKey: listItemsKeys.all,
          refetchType: 'all'
        });
        setIsRefetching(false);
      }
    });
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
  };

  const handleSaveEdit = ({ itemId, updates }) => {
    const originalItem = localItems.find(item => item.id === itemId);

    updateItemMutation.mutate(
      {
        id: itemId,
        content: updates.content,
        priority: originalItem?.priority || 'medium',
        scheduledAt: updates.scheduledAt
      },
      {
        onSuccess: async () => {
          setItemToEdit(null);
          setIsRefetching(true);
          await queryClient.invalidateQueries({
            queryKey: listItemsKeys.all,
            refetchType: 'all'
          });
          setIsRefetching(false);
        },
        onError: (error) => {
          console.error('Error al editar tarea:', error);
          toast.error('Error al editar la tarea');
        },
      }
    );
  };

  const handleChangeList = ({ itemId, newListId }) => {
    const item = localItems.find(i => i.id === itemId);
    if (!item) return;

    const newList = lists.find(l => l.id === newListId);

    updateItemMutation.mutate(
      {
        id: itemId,
        listId: newListId,
        content: item.content,
        priority: item.priority || 'medium',
        scheduledAt: item.scheduledAt
      },
      {
        onMutate: async ({ id, listId }) => {
          await queryClient.cancelQueries({ queryKey: listItemsKeys.all });

          const allQueries = queryClient.getQueriesData({ queryKey: listItemsKeys.all });

          allQueries.forEach(([queryKey, oldData]) => {
            if (!oldData) return;

            queryClient.setQueryData(queryKey, (current) => {
              if (!current) return current;

              if (Array.isArray(current)) {
                return current.map(i =>
                  i.id === id
                    ? { ...i, listId, list: { id: listId, title: newList?.title || 'Lista' } }
                    : i
                );
              }

              if (current.data?.items) {
                return {
                  ...current,
                  data: {
                    ...current.data,
                    items: current.data.items.map(i =>
                      i.id === id
                        ? { ...i, listId, list: { id: listId, title: newList?.title || 'Lista' } }
                        : i
                    )
                  }
                };
              }

              return current;
            });
          });

          return { previousData: allQueries };
        },
        onSuccess: async () => {
          setItemToChangeList(null);
          setIsRefetching(true);

          await queryClient.invalidateQueries({
            queryKey: listItemsKeys.all,
            refetchType: 'all'
          });

          setIsRefetching(false);

          const listName = newList?.title || 'otra lista';
          toast.success(`Tarea movida a ${listName}`, {
            duration: 2000,
          });
        },
        onError: (error, variables, context) => {
          console.error('Error al cambiar lista:', error);

          if (context?.previousData) {
            context.previousData.forEach(([queryKey, data]) => {
              queryClient.setQueryData(queryKey, data);
            });
          }

          toast.error('Error al cambiar la lista');
        },
      }
    );
  };

  const handleDeleteItem = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItemMutation.mutateAsync(itemToDelete);
      setShowDeleteModal(false);
      setItemToDelete(null);
      toast.success('Tarea eliminada con éxito', {
        duration: 2000,
      });
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleAddTask = (e) => {
    if (e) e.preventDefault();
    if (!newTaskText.trim()) return;

    if (editingItemId) {
      updateItemMutation.mutate(
        {
          id: editingItemId,
          content: newTaskText.trim()
        },
        {
          onSuccess: () => {
            setNewTaskText('');
            setEditingItemId(null);
          },
          onError: (error) => {
            console.error('Error al editar tarea:', error);
          },
        }
      );
      return;
    }

    // Si es hoy, usar hora actual + 1 minuto; si no, usar medianoche del día
    let scheduledAt;
    if (isToday) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      scheduledAt = now.toISOString();
    } else {
      scheduledAt = date || new Date().toISOString();
    }

    const itemData = {
      content: newTaskText.trim(),
      description: '',
      priority: 'medium',
      scheduledAt: scheduledAt,
      metadata: {},
    };

    addItemMutation.mutate(itemData, {
      onSuccess: () => {
        setNewTaskText('');
      },
      onError: (error) => {
        console.error('Error al agregar tarea:', error);
        toast.error('Error al crear la tarea');
      },
    });
  };

  return (
    <>
      <div
        className="
          border border-border rounded-lg
          w-full
          md:min-w-[240px] md:max-w-[260px] md:flex-shrink-0
          flex flex-col
        "
        style={{
          height: 'fit-content',
          maxHeight: '700px',
          background: '#0F1521'
        }}
      >
        <div className="flex items-center justify-between mb-3 py-1 px-4 pt-3 flex-shrink-0">
          <h3 className="text-sm font-semibold text-foreground">
            {isToday && `${t('next7Days.today')} - `}{dayName}
          </h3>
          {localItems.length === 0 && (
            <button
              type="button"
              onClick={() => setMobileComposerOpen(true)}
              className="md:hidden p-1"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 px-4">
          {(isLoading || isRefetching) && (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          )}

          {!isLoading && !isRefetching && localItems.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {localItems.map((item) => (
                      <SortableTaskItem
                        key={item.id}
                        item={item}
                        onToggle={handleToggle}
                        onDelete={handleDeleteItem}
                        onEdit={handleEditItem}
                        onViewList={setItemToChangeList}
                        isToggling={togglingItemId === item.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Input para agregar tarea - oculto en mobile cuando no hay tareas y mientras carga */}
        {!isLoading && !isRefetching && (
          <form onSubmit={handleAddTask} className={`w-full mt-3 px-4 pb-3 flex-shrink-0 ${localItems.length === 0 ? 'hidden md:block' : ''}`}>
            <div className="relative flex items-center gap-2 px-3 py-2 bg-background rounded-lg w-full" style={{ border: '1px solid #444358' }}>
              {addItemMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
              ) : (
                <Plus className="w-4 h-4 flex-shrink-0" style={{ color: '#444358' }} />
              )}
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Agregar tarea"
                className="flex-1 bg-transparent text-sm focus:outline-none min-w-0 placeholder:text-[#444358]"
                style={{ color: '#FFFFFF' }}
                disabled={addItemMutation.isPending}
              />
              {newTaskText.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowListSelector(!showListSelector)}
                    className="p-1 hover:bg-accent/10 rounded transition-colors"
                  >
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  {/* Dropdown de listas */}
                  {showListSelector && newTaskText.length > 1 && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedListId(null);
                            setShowListSelector(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-accent/10 transition-colors ${!selectedListId ? 'bg-accent/20' : ''
                            }`}
                        >
                          Lista por defecto
                        </button>
                        {lists.map((list) => (
                          <button
                            key={list.id}
                            type="button"
                            onClick={() => {
                              setSelectedListId(list.id);
                              setShowListSelector(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-accent/10 transition-colors ${selectedListId === list.id ? 'bg-accent/20' : ''
                              }`}
                          >
                            {list.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      {/* COMPOSER MOBILE */}
      {isMobileComposerOpen && (
        <div className="fixed inset-x-0 bottom-0 bg-[#0F141B] border-t border-border p-4 z-50 md:hidden">
          {/* Chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {/* Hoy día */}
            <button
              onClick={() => setSelectedChip('hoy')}
              className={`
                px-6 py-1 rounded-full text-sm whitespace-nowrap transition
                ${selectedChip === 'hoy'
                  ? 'bg-[#8465FF] text-white'
                  : 'bg-background text-foreground border border-border'
                }
              `}
              style={{ height: '28px' }}
            >
              Hoy día
            </button>

            {/* Mañana */}
            <button
              onClick={() => setSelectedChip('mañana')}
              className={`
                px-6 py-1 rounded-full text-sm whitespace-nowrap transition
                ${selectedChip === 'mañana'
                  ? 'bg-[#8465FF] text-white'
                  : 'bg-background text-foreground border border-border'
                }
              `}
              style={{ height: '28px' }}
            >
              Mañana
            </button>

            {/* Día actual */}
            <button
              onClick={() => setSelectedChip('dia')}
              className={`
                px-6 py-1 rounded-full text-sm whitespace-nowrap transition
                ${selectedChip === 'dia'
                  ? 'bg-[#8465FF] text-white'
                  : 'bg-background text-foreground border border-border'
                }
              `}
              style={{ height: '28px' }}
            >
              {dayName}
            </button>
          </div>

          {/* Input grande */}
          <div className="flex items-center gap-2 bg-input border border-border rounded-full px-4 py-3">
            <input
              className="flex-1 bg-transparent text-sm leading-5 font-['DM_Sans'] text-white outline-none"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Agregar tarea"
              autoFocus
            />

            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1D2430]">
              <List className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Botón aceptar */}
          <button
            onClick={() => {
              handleAddTask();
              setMobileComposerOpen(false);
            }}
            className="mt-4 w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm"
          >
            Aceptar
          </button>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-card border border-border rounded-lg p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">¿Eliminar tarea?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-accent/10 transition-colors"
                disabled={deleteItemMutation.isPending}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteItemMutation.isPending}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {deleteItemMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de subtareas */}
      {selectedItemForSubtasks && (
        <SubtasksModal
          item={selectedItemForSubtasks}
          onClose={() => setSelectedItemForSubtasks(null)}
        />
      )}

      {/* Modal de edición */}
      {itemToEdit && (
        <EditTaskModal
          item={itemToEdit}
          onClose={() => setItemToEdit(null)}
          onSave={handleSaveEdit}
          isSaving={updateItemMutation.isPending}
        />
      )}

      {/* Modal de cambio de lista */}
      {itemToChangeList && (
        <ChangeListModal
          item={itemToChangeList}
          lists={lists}
          onClose={() => setItemToChangeList(null)}
          onChangeList={handleChangeList}
          isChanging={updateItemMutation.isPending}
        />
      )}
    </>
  );
};

export default DayColumn;
