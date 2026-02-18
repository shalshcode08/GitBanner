import { Link } from "react-router";
import { useTheme } from "../context/ThemeProvider";
import { AppLogo } from "../icons/HeaderIcons";
import ThemeToggleBtn from "./ThemeToggle";
import { AppRoutes } from "../routes";

const HomepageHeader = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <Link to={AppRoutes.Home}>
        <AppLogo fillColor={theme === "dark" ? "#ffffff" : "#232323"} />
      </Link>
      <ThemeToggleBtn />
    </div>
  );
};

export default HomepageHeader;
