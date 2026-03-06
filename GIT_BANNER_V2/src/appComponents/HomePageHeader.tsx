import { Link } from "react-router";
import { useTheme } from "../context/ThemeProvider";
import { AppLogo } from "../icons/HeaderIcons";
import ThemeToggleBtn from "./ThemeToggle";
import { AppRoutes } from "../routes";

const HomepageHeader = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full flex items-center justify-between">
      <Link to={AppRoutes.Home}>
        <AppLogo
          fillColor={theme === "dark" ? "#e6edf3" : "#1f2328"}
          height={36}
        />
      </Link>
      <ThemeToggleBtn />
    </div>
  );
};

export default HomepageHeader;
