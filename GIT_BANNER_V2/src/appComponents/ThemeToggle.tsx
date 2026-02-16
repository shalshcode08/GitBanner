import { Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { useTheme } from "../context/ThemeProvider";

const ThemeToggleBtn = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="border rounded-sm flex items-center justify-center">
      <Button variant={"ghost"} onClick={toggleTheme}>
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
};

export default ThemeToggleBtn;
