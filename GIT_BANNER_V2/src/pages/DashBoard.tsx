import DashBoardLayout from "../layout/DashBoardLayout";
import AppDashboard from "../appComponents/AppDashboard";
import { useEffect, useState } from "react";

const DashBoard = () => {
  const [openDialoge, setOpenDialoge] = useState<boolean>(false);
  useEffect(() => {
    setOpenDialoge(true);
  }, []);

  return (
    <DashBoardLayout>
      <AppDashboard openDialoge={openDialoge} setOpenDialoge={setOpenDialoge} />
    </DashBoardLayout>
  );
};

export default DashBoard;
