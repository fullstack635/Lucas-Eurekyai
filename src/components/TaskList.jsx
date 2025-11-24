import { MoreVertical } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAllUserItems, useListItems, useToggleItemCompletion, useDeleteItem, useUpdateItem } from "@/features/lists/hooks/useListItemsQuery";
import { useLists } from "@/features/lists/hooks/useListsQuery";
import { cn } from "@/lib/utils";

export const TaskList = ({ listId = null, filterByListName = null }) => {
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
    // TODO: Implement change list functionality
    console.log("Change list for item:", item);
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
    </section>
  );
};
