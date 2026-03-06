import { Link } from "react-router";
import { AppRoutes } from "../routes";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-sm text-muted-foreground">
        This page doesn't exist.
      </p>
      <Link
        to={AppRoutes.Home}
        className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
};

export default NotFound;
