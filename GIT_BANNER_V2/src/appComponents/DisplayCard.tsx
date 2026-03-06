import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router";

interface Props {
  title: string;
  description: string;
  image: string;
  link: string;
}

const DisplayCard = ({ title, description, image, link }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(link)}
      className={cn(
        "group w-full overflow-hidden rounded-md border border-border bg-card",
        "cursor-pointer transition-all duration-200",
        "hover:border-primary hover:shadow-lg hover:shadow-primary/10",
      )}
    >
      {/* Banner preview */}
      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-background">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        {image && (
          <img
            src={image}
            alt={title}
            className="relative z-20 h-[90%] w-[82%] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {description}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Create <ArrowRight size={12} />
        </div>
      </div>
    </div>
  );
};

export default DisplayCard;
