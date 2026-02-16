import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

interface Props {
  title: string;
  description: string;
  image: string;
  link?: string;
}

const DisplayCard = ({ title, description, image }: Props) => {
  return (
    <div className="w-full overflow-hidden border rounded-md bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-white dark:bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        {image && (
          <img
            src={image}
            alt={title || "card-banner-img"}
            className="relative z-20 h-full w-[84%] object-contain"
          />
        )}
      </div>

      <div className="flex items-center justify-between p-4 gap-4">
        <div className="flex flex-col min-w-0 gap-1">
          <h3 className="text-sm font-bold truncate">{title}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        </div>

        <Button
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors shrink-0 flex items-center gap-1 hover:cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            navigate(link);
          }}
        >
          <Plus size={16} />
          Create
        </Button>
      </div>
    </div>
  );
};

export default DisplayCard;
