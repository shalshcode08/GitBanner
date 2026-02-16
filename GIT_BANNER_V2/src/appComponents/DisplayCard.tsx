import { Plus } from "lucide-react";
import type { CardMeta } from "../types/cards";

type Props = CardMeta;

const DisplayCard = ({ title, description, image, link }: Props) => {
  return (
    <div className="w-full overflow-hidden border rounded-md bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full h-48 overflow-hidden bg-muted">
        <img
          src={image}
          alt={title || "card-banner-img"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex items-center justify-between p-4 gap-4">
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-bold truncate">{title}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        </div>

        <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors shrink-0 flex items-center gap-2">
          <Plus size={16} />
          Create
        </button>
      </div>
    </div>
  );
};

export default DisplayCard;
