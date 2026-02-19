import ThemeToggleBtn from "../appComponents/ThemeToggle";
import { CreateBtn } from "../utils/createCustomAppBtn";
import { Download, Github, SidebarIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { useSidebar } from "../components/ui/sidebar";
import UserNameInputModal from "./UserNameInputModal";
import { useIsMobile } from "../hooks/use-mobile";
import { storage } from "../utils/localStorage";
import { APP_USERNAME_KEY } from "../utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";

const HeaderSection = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const username = storage.get<string>(APP_USERNAME_KEY, "");

  console.log("=>", username);

  return (
    <div className="px-4 flex items-center gap-4 justify-between w-full">
      <div>
        <CreateBtn onClick={toggleSidebar}>
          <SidebarIcon size={17} />
        </CreateBtn>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 max-w-[200px]">
          <Github size={17} className="shrink-0" />
          <Tooltip>
            <TooltipTrigger className="min-w-0 text-sm text-muted-foreground underline truncate cursor-default">
              <p>{username}</p>
            </TooltipTrigger>
            <TooltipContent>{username}</TooltipContent>
          </Tooltip>
        </div>
        <ThemeToggleBtn />
        <Button
          className="h-full py-3 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 hover:cursor-pointer"
          onClick={() => {}}
        >
          <Download size={16} />
          {!isMobile ? "Download" : ""}
        </Button>
      </div>
    </div>
  );
};

interface Props {
  openDialoge: boolean;
  setOpenDialoge: (open: boolean) => void;
}

const AppDashboard = ({ openDialoge, setOpenDialoge }: Props) => {
  return (
    <>
      <HeaderSection />
      {/*TODO: remove default open={ false } to correct {openDialoge}*/}
      <UserNameInputModal open={false} setOpen={setOpenDialoge} />
    </>
  );
};

export default AppDashboard;
