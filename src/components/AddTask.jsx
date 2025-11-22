import { useState } from "react";
import { List, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const listOptions = ["Personal", "Trabajo"];

export const AddTask = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [listPopoverOpen, setListPopoverOpen] = useState(false);

  const handleSubmit = () => {
    if (taskTitle.trim() && selectedList) {
      onAddTask(taskTitle, selectedList);
      setTaskTitle("");
      setSelectedList(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setTaskTitle("");
      setSelectedList(null);
    }
  };

  return (
    <div className="bg-card rounded-[70px] pl-8 pt-[8px] pb-[2px] pr-6 mx-4 lg:mx-0">
      <div className="flex items-center gap-2 mb-3">
        <Input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Agregar tarea"
          className="flex-1 bg-transparent outline-none h-12 text-base"
        />
        <Popover open={listPopoverOpen} onOpenChange={setListPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 mt-2 flex-shrink-0 rounded-full bg-trigger hover:bg-accent"
            >
              <List className="w-5 h-5 bg-trigger-list" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 -mt-[230px] p-0" align="end">
            <div className="p-0 bg-sidebar">
              <div className="p-4 w-full flex items-center justify-between text-sm rounded-sm transition-colors border-b border-border">
                  MIS LISTAS
              </div>
              {listOptions.map((list) => (
                <button
                  key={list}
                  onClick={() => {
                    setSelectedList(list);
                    setListPopoverOpen(false);
                  }}
                  className="hover:bg-[#6A52CC] p-4 w-full flex items-center justify-between text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span>{list}</span>
                  
                  {selectedList === list && (
                    <Check className="w-3 h-3 text-[#000000] text-primary bg-[#ABFFA8] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
