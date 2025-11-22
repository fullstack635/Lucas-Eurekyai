import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import UnionIcon from "@/assets/icons/Union.svg";
import Soporte from "@/assets/icons/life-buoy-01.svg";
import Ajustes from "@/assets/icons/settings-01.svg";
import EurekyLogo from "@/assets/icons/Union (1).svg";
import HomeIcon from "@/assets/icons/home-line.svg";
import CalendarDaysIcon from "@/assets/icons/rows-01.svg";
import ListTodoIcon from "@/assets/icons/check-done-01.svg";
import CalendarIcon from "@/assets/icons/bar-chart-square-02.svg";
import VectorLeft from "@/assets/icons/Vector.svg";
import VectorRight from "@/assets/icons/Vector (1).svg";
import NavAccountMenuIcon from "@/assets/icons/__Nav account card menu button.svg";

export const Sidebar = ({ activeSection, onSectionChange, lists, onAddList }) => {
  const mainSections = [
    { id: "mi-dia", label: "Mi día", icon: HomeIcon },
    { id: "proximos-7", label: "Próximos 7 días", icon: CalendarIcon },
    { id: "tareas", label: "Tareas", icon: CalendarDaysIcon },
    { id: "calendario", label: "Mi calendario", icon: ListTodoIcon },
  ];

  return (
    <aside className="w-[300px] bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <img src={UnionIcon} alt="Logo" className="lg:h-[21px] lg:w-[42px] h-[17.12px] w-[34.24px]" />
          <img src={EurekyLogo} alt="eureky" className="lg:h-[28px] lg:w-[107.33px] h-[22.82px] w-[87.49px]" />
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1 mb-6">
          {mainSections.map((section) => {
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <img src={section.icon} alt="" className="w-4 h-4" />
                <span className="lg:text-[16px]">{section.label}</span>
              </button>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between px-3 py-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Mis Listas</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={onAddList}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {lists.map((list) => (
              <button
                key={list}
                onClick={() => onSectionChange(list)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  activeSection === list
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <span className="text-[16px]">{list}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-3 space-y-1 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <img src={Soporte} alt="Logo" className="lg:h-[20px] lg:w-[20px] svg-theme" />
          <span className="lg:text-[16px]">Soporte</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <img src={Ajustes} alt="Logo" className="lg:h-[20px] lg:w-[20px] svg-theme" />
          <span className="lg:text-[16px]">Ajustes</span>
        </button>
      </div>

      <div className="p-3 border-t border-sidebar-border">
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

      <div className="p-3 border-t border-sidebar-border">
        <div className="bg-card p-3 rounded-lg flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-[#312465] flex items-center justify-center">
            <div className="absolute -bottom-0.5 -right-[0.0px] w-3 h-3 rounded-full bg-[#6FE36B] border-[1px] border-sidebar"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate lg:text-[14px]">Roger</p>
            <p className="text-xs text-muted-foreground truncate lg:text-[14px]">roger@untitledui.com</p>
          </div>
          <img 
            src={NavAccountMenuIcon} 
            alt="Menu" 
            className="w-8 h-8 flex-shrink-0 cursor-pointer"
          />
        </div>
      </div>
    </aside>
  );
};
