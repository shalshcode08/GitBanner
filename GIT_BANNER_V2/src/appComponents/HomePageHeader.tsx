import { useTheme } from "../context/ThemeProvider";
import { AppLogo } from "../icons/HeaderIcons";
import ThemeToggleBtn from "./ThemeToggle";

const HomepageHeader = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between px-4">
      <AppLogo fillColor={theme === "dark" ? "#ffffff" : "#232323"} />
      <ThemeToggleBtn />
    </div>
  );
};

export default HomepageHeader;
