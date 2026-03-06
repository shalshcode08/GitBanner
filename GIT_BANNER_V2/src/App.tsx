import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { AppRoutes } from "./routes";

const Home = lazy(() => import("./pages/Home"));
const DashBoard = lazy(() => import("./pages/DashBoard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Suspense>
      <Routes>
        <Route path={AppRoutes.Home} element={<Home />} />
        <Route path={AppRoutes.Dashboard} element={<DashBoard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
