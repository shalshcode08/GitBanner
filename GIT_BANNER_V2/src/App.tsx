import { Route } from "react-router";
import { Routes } from "react-router";
import { AppRoutes } from "./routes";
import Home from "./appComponents/Home";

function App() {
  return (
    <Routes>
      <Route path={AppRoutes.Home} element={<Home />} />
    </Routes>
  );
}

export default App;
