import ThemeToggleBtn from "../appComponents/ThemeToggle";
import { CreateBtn } from "../utils/createCustomAppBtn";
import { Download, SidebarIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { useSidebar } from "../components/ui/sidebar";
import UserNameInputModal from "./UserNameInputModal";

const HeaderSection = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="p-2 px-4 flex items-center gap-4 justify-between w-full">
      <div>
        <CreateBtn onClick={toggleSidebar}>
          <SidebarIcon size={17} />
        </CreateBtn>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggleBtn />
        <Button
          className="h-full py-3 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 hover:cursor-pointer"
          onClick={() => {}}
        >
          <Download size={16} />
          Download
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
      <UserNameInputModal open={openDialoge} setOpen={setOpenDialoge} />
    </>
  );
};

export default AppDashboard;
