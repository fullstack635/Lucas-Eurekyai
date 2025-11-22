import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/shared/contexts/AppContext";
import { cn } from "@/lib/utils";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative h-10 w-10 rounded-full transition-colors",
        "bg-background/80 backdrop-blur-sm border border-border",
        "hover:bg-accent hover:border-accent",
        "shadow-md"
      )}
      aria-label="Toggle theme"
    >
      <Sun className={cn(
        "h-5 w-5 rotate-0 scale-100 transition-all absolute",
        theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
      )} />
      <Moon className={cn(
        "h-5 w-5 rotate-90 scale-0 transition-all absolute",
        theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

