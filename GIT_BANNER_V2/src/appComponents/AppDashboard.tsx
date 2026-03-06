import ThemeToggleBtn from "../appComponents/ThemeToggle";
import { CreateBtn } from "../utils/createCustomAppBtn";
import { Download, Github, LoaderCircle, SidebarIcon, TriangleAlert } from "lucide-react";
import { Button } from "../components/ui/button";
import { useSidebar } from "../components/ui/sidebar";
import UserNameInputModal from "./UserNameInputModal";
import { useIsMobile } from "../hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { cn } from "../lib/utils";
import { useDashboard } from "../context/DashboardContext";
import { useBanner } from "../hooks/useBanner";
import { fetchBannerBlob } from "../api/banner";
import { useState, useCallback } from "react";

// ─── Header ───────────────────────────────────────────────────────────────────

const HeaderSection = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { username } = useDashboard();
  const { params } = useBanner();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!params || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await fetchBannerBlob(params);
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${params.username}-${params.type}-${params.format}.svg`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // silently ignore — banner may not be loaded yet
    } finally {
      setIsDownloading(false);
    }
  }, [params, isDownloading]);

  return (
    <div className="px-4 flex items-center gap-4 justify-between w-full">
      <div>
        <CreateBtn onClick={toggleSidebar}>
          <SidebarIcon size={17} />
        </CreateBtn>
      </div>
      <div className="flex items-center gap-4">
        {username && (
          <div className="flex items-center gap-2 max-w-[200px]">
            <Github size={17} className="shrink-0" />
            <Tooltip>
              <TooltipTrigger className="min-w-0 text-sm text-muted-foreground underline truncate cursor-default">
                <p>{username}</p>
              </TooltipTrigger>
              <TooltipContent>{username}</TooltipContent>
            </Tooltip>
          </div>
        )}
        <ThemeToggleBtn />
        <Button
          className="h-full py-3 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 hover:cursor-pointer disabled:opacity-50"
          onClick={handleDownload}
          disabled={!params || isDownloading}
        >
          {isDownloading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {!isMobile ? "Download" : ""}
        </Button>
      </div>
    </div>
  );
};

// ─── Main canvas ──────────────────────────────────────────────────────────────

type ImgStatus = "loading" | "loaded" | "error";

const MainContentSection = () => {
  const { bannerUrl } = useBanner();
  const [imgStatus, setImgStatus] = useState<ImgStatus>("loading");

  return (
    <div className="relative flex-1 min-h-0 w-full bg-background overflow-hidden">
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-20 p-4 flex items-center justify-center w-full h-full">
        {!bannerUrl ? (
          <p className="text-sm text-muted-foreground">
            Enter a GitHub username to generate your banner.
          </p>
        ) : (
          <div className="w-full max-w-4xl">
            {/* Skeleton shown while image loads */}
            {imgStatus === "loading" && (
              <div className="w-full aspect-[1500/500] rounded-xl bg-muted animate-pulse flex items-center justify-center">
                <LoaderCircle size={28} className="animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Error state */}
            {imgStatus === "error" && (
              <div className="w-full aspect-[1500/500] rounded-xl border border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-2">
                <TriangleAlert size={22} className="text-destructive" />
                <p className="text-sm text-destructive">
                  Failed to load banner. Check the username or try again.
                </p>
              </div>
            )}

            {/* Banner — always rendered so browser caches; hidden until loaded */}
            <img
              key={bannerUrl}
              src={bannerUrl}
              alt="GitHub banner preview"
              className={cn(
                "w-full rounded-xl shadow-lg",
                imgStatus === "loaded" ? "block" : "hidden",
              )}
              onLoad={() => setImgStatus("loaded")}
              onError={() => setImgStatus("error")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

interface Props {
  openDialoge: boolean;
  setOpenDialoge: (open: boolean) => void;
}

const AppDashboard = ({ openDialoge, setOpenDialoge }: Props) => {
  return (
    <div className="flex flex-col h-full w-full">
      <HeaderSection />
      <MainContentSection />
      <UserNameInputModal open={openDialoge} setOpen={setOpenDialoge} />
    </div>
  );
};

export default AppDashboard;
