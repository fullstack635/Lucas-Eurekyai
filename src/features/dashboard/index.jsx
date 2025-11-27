import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import UnionIcon from "@/assets/icons/Union.svg";
import EurekyLogo from "@/assets/icons/Union (1).svg";
import { MiDiaSection } from "./sections/MiDiaSection";
import { Proximos7Section } from "./sections/Proximos7Section";
import { TareasSection } from "./sections/TareasSection";
import { CalendarioSectionView } from "./sections/CalendarioSection";
import { TaskList } from "@/components/TaskList";
import { AddTask } from "@/components/AddTask";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("mi-dia");

  // Mock calendar events - TODO: Replace with actual calendar API integration
  const [calendarEvents] = useState([
    { time: "8:00-9:00", title: "Reunión Mónica" },
    { time: "11:00-12:00", title: "Status equipo", badge: "Únirse" },
    { time: "15:00-15:30", title: "Feedback" },
    { time: "17:00-18:00", title: "Status equipo" },
    { time: "19:00-20:00", title: "Gimnasio" },
  ]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <div className="mx-auto lg:p-6 px-4">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-sidebar mb-6">
            {/* Left: User Avatar with Green Badge */}
            <div className="relative w-10 h-10 rounded-full bg-[#312465] flex items-center justify-center flex-shrink-0">
              <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-[#6FE36B] border-[1px] border-sidebar"></div>
            </div>

            {/* Middle: Logo Icons */}
            <div className="flex items-center gap-2 flex-1 justify-center">
              <img src={UnionIcon} alt="Logo" className="h-6 w-auto svg-icon" />
              <img src={EurekyLogo} alt="eureky" className="h-7 w-auto svg-icon" />
            </div>

            {/* Right: More Options */}
            <div className="flex items-center gap-2">
              {/* <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <Sidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    lists={lists}
                    onAddList={() => console.log("Add list")}
                  />
                </SheetContent>
              </Sheet> */}
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Render section based on activeSection */}
          {activeSection === "mi-dia" && (
            <MiDiaSection calendarEvents={calendarEvents} />
          )}

          {activeSection === "proximos-7" && (
            <Proximos7Section />
          )}

          {activeSection === "tareas" && (
            <TareasSection />
          )}

          {activeSection === "calendario" && (
            <CalendarioSectionView />
          )}

          {/* Render custom list view if a list is selected */}
          {activeSection !== "mi-dia" &&
            activeSection !== "proximos-7" &&
            activeSection !== "tareas" &&
            activeSection !== "calendario" && (
              <>
                <h1 className="text-[32px] lg:text-[48px] font-bold mb-8 px-4 lg:px-0">
                  {activeSection}
                </h1>
                <TaskList filterByListName={activeSection} />
                <AddTask />
              </>
            )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
    </div>
  );
};

export default Dashboard;