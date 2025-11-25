import { MoreVertical, Check } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useAllUserItems, useListItems, useToggleItemCompletion, useDeleteItem, useUpdateItem } from "@/features/lists/hooks/useListItemsQuery";
import { useLists } from "@/features/lists/hooks/useListsQuery";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const TaskList = ({ listId = null, filterByListName = null }) => {
  // State for list selection modal
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch all user items or items for a specific list
  const { data: allItems = [], isLoading: isLoadingAll } = useAllUserItems({ 
    isCompleted: false,
    limit: 100 
  });
  
  const { data: listItems = [], isLoading: isLoadingList } = useListItems(listId, {
    includeSubtasks: true,
    limit: 100
  });

  // Fetch lists to get list names
  const { data: lists = [] } = useLists({ 
    status: 'ACTIVE',
    includeItems: false 
  });

  // Mutations
  const toggleMutation = useToggleItemCompletion();
  const deleteMutation = useDeleteItem();
  const updateMutation = useUpdateItem();

  // Determine which items to display
  const items = listId ? listItems : allItems;
  const isLoading = listId ? isLoadingList : isLoadingAll;

  // Filter by list name if provided
  const filteredItems = filterByListName 
    ? items.filter(item => {
        const itemList = lists.find(l => l.id === item.listId);
        return itemList?.name === filterByListName;
      })
    : items;

  // Get list name for an item
  const getListName = (item) => {
    if (!item.listId) return 'Personal';
    const list = lists.find(l => l.id === item.listId);
    return list?.name || 'Personal';
  };

  const handleToggle = (itemId) => {
    toggleMutation.mutate(itemId);
  };

  const handleDelete = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const handleEdit = (item) => {
    // TODO: Implement edit functionality (open edit modal/form)
    console.log("Edit item:", item);
  };

  const handleChangeList = (item) => {
    setSelectedItem(item);
    setIsListModalOpen(true);
  };

  const handleSelectList = (targetListId) => {
    if (!selectedItem) return;

    // Update the item with the new listId
    updateMutation.mutate(
      {
        id: selectedItem.id,
        listId: targetListId,
      },
      {
        onSuccess: () => {
          setIsListModalOpen(false);
          setSelectedItem(null);
        },
      }
    );
  };

  return (
    <section className="mb-8 px-4 lg:px-0">
      <h2 className="lg:text-[20px] text-[16px] font-semibold mb-4">Tareas</h2>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Cargando tareas...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-sm text-muted-foreground">No hay tareas</div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const listName = getListName(item);
            return (
              <div
                key={item.id}
                className={cn(
                  "bg-card rounded-lg p-4 flex items-center gap-3 sidebar-button-hover sidebar-nav-button"
                )}
              >
                <Checkbox
                  checked={item.isCompleted || false}
                  onCheckedChange={() => handleToggle(item.id)}
                  className="border-muted-foreground checkbox-border-color"
                />
                <div className="flex-1">
                  <p className={cn(
                    "text-sm",
                    item.isCompleted && "line-through text-muted-foreground"
                  )}>
                    {item.content || item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    MIS LISTAS • {listName.toUpperCase()}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-accent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border border-border bg-sidebar mt-5">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeList(item);
                      }} 
                      className="p-3 hover:bg-[#6A52CC] hover:text-accent-foreground border-b border-border"
                    >
                      Lista
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }} 
                      className="p-3 hover:bg-[#6A52CC] hover:text-accent-foreground border-b border-border"
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="text-destructive p-3 hover:bg-[#6A52CC] hover:text-accent-foreground"
                    >
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      )}

      {/* List Selection Modal */}
      <Dialog open={isListModalOpen} onOpenChange={setIsListModalOpen}>
        <DialogContent className="sm:max-w-md bg-sidebar border-border bottom-0 top-auto translate-y-0 sm:top-[70%] sm:translate-y-[-120%] rounded-t-lg sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              Mover a
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-0">
            {lists.map((list) => {
              const isSelected = selectedItem?.listId === list.id;
              return (
                <button
                  key={list.id}
                  onClick={() => handleSelectList(list.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 text-sm transition-colors border-b border-border last:border-b-0",
                    "hover:bg-[#6A52CC] hover:text-accent-foreground"
                  )}
                >
                  <span>{list.name}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#ABFFA8] flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#000000]" />
                    </div>
                  )}
                  {!isSelected && (
                    <div className="w-5 h-5 rounded-full border border-muted-foreground" />
                  )}
                </button>
              );
            })}
            {/* Option to move to default list (no list) */}
            <button
              onClick={() => handleSelectList(null)}
              className={cn(
                "w-full flex items-center justify-between p-4 text-sm transition-colors border-b border-border last:border-b-0",
                "hover:bg-[#6A52CC] hover:text-accent-foreground"
              )}
            >
              <span>Lista por defecto</span>
              {!selectedItem?.listId && (
                <div className="w-5 h-5 rounded-full bg-[#ABFFA8] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#000000]" />
                </div>
              )}
              {selectedItem?.listId && (
                <div className="w-5 h-5 rounded-full border border-muted-foreground" />
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
