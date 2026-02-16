import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

const ThemeToggleBtn = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="border rounded-md flex items-center justify-center hover:bg-muted transition-colors">
      <div
        className="px-3 py-3 cursor-pointer text-foreground"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      </div>
    </div>
  );
};

export default ThemeToggleBtn;
