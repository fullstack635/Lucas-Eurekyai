import { Home, Calendar, ListTodo, CalendarDays, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileNav = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: "mi-dia", label: "MI DÍA", icon: Home },
    { id: "proximos-7", label: "7 DÍAS", icon: Calendar },
    { id: "tareas", label: "TAREAS", icon: ListTodo },
    { id: "calendario", label: "CALENDARIO", icon: CalendarDays },
    { id: "listas", label: "MIS LISTAS", icon: Menu },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border lg:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors",
                activeSection === section.id
                  ? "text-white dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{section.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
