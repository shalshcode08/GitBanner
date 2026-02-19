import { ArrowLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "../components/ui/sidebar";
import { CreateBtn } from "../utils/createCustomAppBtn";
import { useNavigate } from "react-router";
import { AppRoutes } from "../routes";
import { AppLogo } from "../icons/HeaderIcons";
import { useTheme } from "../context/ThemeProvider";
import { Link } from "react-router";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <Sidebar variant="floating" side="left" className="py-2 pl-4">
      <div className="flex flex-row items-center gap-4 px-2.5 py-2">
        <CreateBtn
          onClick={() => {
            navigate(AppRoutes.Home);
          }}
        >
          <ArrowLeft size={17} />
        </CreateBtn>
        <Link to={AppRoutes.Home} className="mt-[6px]">
          <AppLogo
            fillColor={theme === "dark" ? "#ffffff" : "#232323"}
            height={40}
          />
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
