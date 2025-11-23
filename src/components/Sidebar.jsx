import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRef } from "react";
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

export const Sidebar = ({ activeSection, onSectionChange, lists, onAddList }) => {
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

  return (
    <aside className="w-[300px] bg-sidebar flex flex-col h-screen">
      <div className="p-4 ">
        <div className="flex items-center gap-2 p-2">
          <img src={UnionIcon} alt="Logo" className="lg:h-[21px] lg:w-[42px] h-[17.12px] w-[34.24px] svg-icon" />
          <img src={EurekyLogo} alt="eureky" className="lg:h-[28px] lg:w-[107.33px] h-[22.82px] w-[87.49px] svg-icon" />
        </div>
      </div>

      <nav className="flex-1 pt-3 pb-3 pl-0 pr-0 overflow-y-auto">
        <div className="space-y-1 mb-6">
          {mainSections.map((section) => {
            return (
              <button
                key={section.id}
                onClick={(e) => {
                  onSectionChange(section.id);
                  // Clear any inline styles immediately to let CSS class handle active state
                  e.currentTarget.style.backgroundColor = '';
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-2 text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )}
                onMouseEnter={(e) => {
                  // Only apply hover if button is not active
                  if (activeSection !== section.id) {
                    e.currentTarget.style.backgroundColor = '#424242';
                  }
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
                  // Always clear inline style on mouse leave
                  // CSS class will handle the active state background
                  e.currentTarget.style.backgroundColor = '';
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
          <div className="flex items-center justify-between px-6 py-2 mb-2" 
                        onClick={onAddList}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#424242';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                        }}
          >
            <span className="text-xs font-semibold text-muted-foreground uppercase">Mis Listas</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"

            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {lists.map((list) => (
              <button
                key={list}
                onClick={(e) => {
                  onSectionChange(list);
                  // Clear any inline styles when button becomes active
                  e.currentTarget.style.backgroundColor = '';
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                  activeSection === list
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )}
                onMouseEnter={(e) => {
                  if (activeSection !== list) {
                    e.currentTarget.style.backgroundColor = '#424242';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== list) {
                    e.currentTarget.style.backgroundColor = '';
                  }
                }}
              >
                <span className="pl-3 text-[16px]">{list}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="pt-3 pb-3 space-y-1">
        <button 
          className="w-full flex items-center gap-3 px-6 py-2 text-sm text-sidebar-foreground transition-colors"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#424242';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
          }}
        >
          <img src={Soporte} alt="" className="lg:h-[20px] lg:w-[20px] svg-icon" />
          <span className="lg:text-[16px]">Soporte</span>
        </button>
        <button 
          className="w-full flex items-center gap-3 px-6 py-2 text-sm text-sidebar-foreground transition-colors"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#424242';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
          }}
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
          className="bg-card p-3 rounded-lg flex items-center gap-3 border border-round transition-colors cursor-pointer"
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
