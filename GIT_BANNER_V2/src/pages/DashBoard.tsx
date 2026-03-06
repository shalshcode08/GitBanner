import DashBoardLayout from "../layout/DashBoardLayout";
import AppDashboard from "../appComponents/AppDashboard";
import { useState } from "react";
import { DashboardProvider } from "../context/DashboardContext";
import { storage } from "../utils/localStorage";
import { APP_USERNAME_KEY } from "../utils/constants";

const DashBoard = () => {
  // Show the username modal only if no username is saved yet.
  const [openDialoge, setOpenDialoge] = useState<boolean>(
    !storage.get<string>(APP_USERNAME_KEY, ""),
  );

  return (
    <DashboardProvider>
      <DashBoardLayout>
        <AppDashboard
          openDialoge={openDialoge}
          setOpenDialoge={setOpenDialoge}
        />
      </DashBoardLayout>
    </DashboardProvider>
  );
};

export default DashBoard;
