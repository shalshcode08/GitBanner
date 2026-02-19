import type React from "react";
import AppSidebar from "../appComponents/AppSidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import { TooltipProvider } from "../components/ui/tooltip";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <main className="w-full py-4">{children}</main>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default DashBoardLayout;
