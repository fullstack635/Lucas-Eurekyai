import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import UnionIcon from "@/assets/icons/Union.svg";
import Soporte from "@/assets/icons/life-buoy-01.svg";
import Ajustes from "@/assets/icons/settings-01.svg";
import EurekyLogo from "@/assets/icons/Union (1).svg";
import { ChartNoAxesCombinedIcon } from "./ChartNoAxesCombinedIcon";
import { CreditCardIcon } from "./CreditCardIcon";
import { BlendIcon } from "./BlendIcon";
import { DashboardIcon } from "./DashboardIcon";
import VectorLeft from "@/assets/icons/Vector.svg";
import VectorRight from "@/assets/icons/Vector (1).svg";
import NavAccountMenuIcon from "@/assets/icons/__Nav account card menu button.svg";
import { useLists, useCreateList } from "@/features/lists/hooks/useListsQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Input } from "./ui/input";

export const Sidebar = ({ activeSection, onSectionChange }) => {
  // Fetch lists from backend
  const { data: lists = [], isLoading: isLoadingLists } = useLists({ 
    status: 'ACTIVE',
    isCompleted: false,
    includeItems: false,
    limit: 50,
    offset: 0,
    orderBy: 'createdAt',
    orderDirection: 'desc'
  });

  // Create list mutation
  const createListMutation = useCreateList();
  
  // State for add list popover
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const chartIconRef = useRef(null);
  const creditCardIconRef = useRef(null);
  const blendIconRef = useRef(null);
  const dashboardIconRef = useRef(null);

  const mainSections = [
    { id: "mi-dia", label: "Mi día", icon: BlendIcon, isComponent: true },
    { id: "proximos-7", label: "Próximos 7 días", icon: ChartNoAxesCombinedIcon, isComponent: true },
    { id: "tareas", label: "Tareas", icon: CreditCardIcon, isComponent: true },
    { id: "calendario", label: "Mi calendario", icon: DashboardIcon, isComponent: true },
  ];

  // Handle creating a new list
  const handleCreateList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newListName.trim()) return;

    createListMutation.mutate(
      {
        name: newListName.trim(),
        description: "",
        metadata: {}
      },
      {
        onSuccess: () => {
          setNewListName("");
          setPopoverOpen(false);
        },
        onError: (error) => {
          console.error("Error creating list:", error);
        }
      }
    );
  };

  // Get list names for display
  const listNames = lists.map(list => list.name || list);

  return (
    <aside className="w-[300px] bg-sidebar flex flex-col h-screen">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 p-2">
          <img src={UnionIcon} alt="Logo" className="lg:h-[21px] lg:w-[42px] h-[17.12px] w-[34.24px] svg-icon" />
          <img src={EurekyLogo} alt="eureky" className="lg:h-[28px] lg:w-[107.33px] h-[22.82px] w-[87.49px] svg-icon" />
        </div>
      </div>

      <nav className="flex-1 pt-3 pb-3 pl-0 pr-0 overflow-y-auto relative">
        <div className="space-y-1 mb-6">
          {mainSections.map((section) => {
            return (
              <button
                key={section.id}
                onClick={(e) => {
                  onSectionChange(section.id);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-2 text-sm transition-colors sidebar-button-hover sidebar-nav-button",
                  activeSection === section.id
                    ? "sidebar-button-active"
                    : "text-sidebar-foreground"
                )}
                onMouseEnter={(e) => {
                  // Trigger icon animation if it's the blend icon
                  if (section.id === "mi-dia" && blendIconRef.current) {
                    blendIconRef.current.startAnimation();
                  }
                  // Trigger icon animation if it's the chart icon
                  if (section.id === "proximos-7" && chartIconRef.current) {
                    chartIconRef.current.startAnimation();
                  }
                  // Trigger icon animation if it's the credit card icon
                  if (section.id === "tareas" && creditCardIconRef.current) {
                    creditCardIconRef.current.startAnimation();
                  }
                  // Trigger icon animation if it's the dashboard icon
                  if (section.id === "calendario" && dashboardIconRef.current) {
                    dashboardIconRef.current.startAnimation();
                  }
                }}
                onMouseLeave={(e) => {
                  // Stop icon animation if it's the blend icon
                  if (section.id === "mi-dia" && blendIconRef.current) {
                    blendIconRef.current.stopAnimation();
                  }
                  // Stop icon animation if it's the chart icon
                  if (section.id === "proximos-7" && chartIconRef.current) {
                    chartIconRef.current.stopAnimation();
                  }
                  // Stop icon animation if it's the credit card icon
                  if (section.id === "tareas" && creditCardIconRef.current) {
                    creditCardIconRef.current.stopAnimation();
                  }
                  // Stop icon animation if it's the dashboard icon
                  if (section.id === "calendario" && dashboardIconRef.current) {
                    dashboardIconRef.current.stopAnimation();
                  }
                }}
              >
                {section.isComponent ? (
                  <section.icon 
                    ref={section.id === "mi-dia" ? blendIconRef : section.id === "proximos-7" ? chartIconRef : section.id === "tareas" ? creditCardIconRef : section.id === "calendario" ? dashboardIconRef : null}
                    size={16} 
                    className="w-4 h-4 text-current"
                    isAnimated={true}
                  />
                ) : (
                  <img src={section.icon} alt="" className="w-4 h-4 svg-icon" />
                )}
                <span className="lg:text-[16px]">{section.label}</span>
              </button>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between px-6 py-2 mb-2 sidebar-button-hover sidebar-nav-button">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Mis Listas</span>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <form onSubmit={handleCreateList} className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nombre de la lista
                    </label>
                    <Input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Ej: Personal, Trabajo..."
                      className="w-full"
                      autoFocus
                      disabled={createListMutation.isPending}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPopoverOpen(false);
                        setNewListName("");
                      }}
                      disabled={createListMutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newListName.trim() || createListMutation.isPending}
                    >
                      {createListMutation.isPending ? "Creando..." : "Crear"}
                    </Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            {isLoadingLists ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Cargando listas...
              </div>
            ) : listNames.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No hay listas
              </div>
            ) : (
              listNames.map((listName, index) => {
                const list = lists[index];
                const listId = list?.id || listName;
                return (
                  <button
                    key={listId}
                    onClick={(e) => {
                      onSectionChange(listName);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors sidebar-button-hover sidebar-nav-button",
                      activeSection === listName
                        ? "sidebar-button-active"
                        : "text-sidebar-foreground"
                    )}
                  >
                    <span className="pl-3 text-[16px]">{listName}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </nav>

      <div className="pt-3 pb-3 space-y-1">
        <button 
          className="w-full flex items-center gap-3 px-6 py-2 text-sm text-sidebar-foreground transition-colors sidebar-button-hover sidebar-nav-button"
        >
          <img src={Soporte} alt="" className="lg:h-[20px] lg:w-[20px] svg-icon" />
          <span className="lg:text-[16px]">Soporte</span>
        </button>
        <button 
          className="w-full flex items-center gap-3 px-6 py-2 text-sm text-sidebar-foreground transition-colors sidebar-button-hover sidebar-nav-button"
        >
          <img src={Ajustes} alt="" className="lg:h-[20px] lg:w-[20px] svg-icon" />
          <span className="lg:text-[16px]">Ajustes</span>
        </button>
      </div>

      <div className="p-3">
        <Button 
          className="hover:opacity-90 transition-opacity relative overflow-hidden flex items-center justify-center"
          style={{ 
            backgroundColor: '#6A52CC',
            width: '269px',
            height: '64px'
          }}
        >
          <img 
            src={VectorRight} 
            alt="" 
            className="absolute left-0 top-4 -translate-y-1/2 w-[63px] h-[64px]"
          />
          <img 
            src={VectorLeft} 
            alt="" 
            className="absolute right-3 top-16 -translate-y-1/2 w-[63px] h-[64px]"
          />
          <span className="relative z-10 lg:text-[18px]">Mejora tu plan</span>
        </Button>
      </div>

      <div className="p-3">
        <div 
          className="bg-card p-3 rounded-lg flex items-center gap-3 border border-round transition-colors cursor-pointer relative z-10"
        >
          <div className="relative w-10 h-10 rounded-full bg-[#312465] flex items-center justify-center">
            <div className="absolute -bottom-0.5 -right-[0.0px] w-3 h-3 rounded-full bg-[#6FE36B] border-[1px] border-sidebar"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate lg:text-[14px]">Roger</p>
            <p className="text-xs text-muted-foreground truncate lg:text-[14px] text-[#444358]">roger@untitledui.com</p>
          </div>
          <img 
            src={NavAccountMenuIcon} 
            alt="Menu" 
            className="w-8 h-8 flex-shrink-0 cursor-pointer svg-icon"
          />
        </div>
      </div>
    </aside>
  );
};
