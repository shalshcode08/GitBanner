import type React from "react";
import AppSidebar from "../appComponents/AppSidebar";
import { SidebarProvider } from "../components/ui/sidebar";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
};

export default DashBoardLayout;
