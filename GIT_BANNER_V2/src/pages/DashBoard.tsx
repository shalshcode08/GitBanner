import DashBoardLayout from "../layout/DashBoardLayout";
import AppDashboard from "../appComponents/AppDashboard";
import { useEffect, useState } from "react";
import { DashboardProvider } from "../context/DashboardContext";

const DashBoard = () => {
  const [openDialoge, setOpenDialoge] = useState<boolean>(false);
  useEffect(() => {
    setOpenDialoge(true);
  }, []);

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
