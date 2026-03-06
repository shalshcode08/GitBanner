import { Route } from "react-router";
import { Routes } from "react-router";
import { AppRoutes } from "./routes";
import Home from "./pages/Home";
import DashBoard from "./pages/DashBoard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path={AppRoutes.Home} element={<Home />} />
      <Route path={AppRoutes.Dashboard} element={<DashBoard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
