import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";
import { CreateBtn } from "../utils/createCustomAppBtn";

const ThemeToggleBtn = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <CreateBtn onClick={toggleTheme}>
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </CreateBtn>
  );
};

export default ThemeToggleBtn;
