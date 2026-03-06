import ThemeToggleBtn from "../appComponents/ThemeToggle";
import { CreateBtn } from "../utils/createCustomAppBtn";
import {
  Download,
  Github,
  LoaderCircle,
  Pencil,
  SidebarIcon,
  TriangleAlert,
} from "lucide-react";
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
import type { BannerParams } from "../api/banner";
import type { ColorPalette } from "../utils/constants";
import type { BannerTheme } from "../context/DashboardContext";
import {
  applyPaletteToContribSvg,
  applyPaletteToStatsSvg,
} from "../utils/svgColors";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── SVG fetch + colour substitution ─────────────────────────────────────────

type SvgStatus = "idle" | "loading" | "loaded" | "error";

/**
 * Fetches the banner SVG as text, applies the colour palette substitution,
 * and returns a blob object URL ready for <img src>.
 *
 * Palette swaps are instant — they only re-process the cached SVG text without
 * triggering a new network request.  The browser HTTP cache still works because
 * we fetch via the normal fetch() API and the backend sends Cache-Control headers.
 */
function useSvgBanner(
  bannerUrl: string | null,
  bannerType: string | null,
  colorPalette: ColorPalette,
  bannerTheme: BannerTheme,
) {
  const [rawSvg, setRawSvg] = useState<string | null>(null);
  const [processedSvg, setProcessedSvg] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<SvgStatus>("idle");
  const prevObjectUrlRef = useRef<string | null>(null);

  // Re-fetch whenever the banner URL changes (username / type / format / theme).
  useEffect(() => {
    if (!bannerUrl) {
      setRawSvg(null);
      setProcessedSvg(null);
      setObjectUrl(null);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setRawSvg(null);

    const controller = new AbortController();

    fetch(bannerUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => setRawSvg(text))
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, [bannerUrl]);

  // Re-apply colours whenever the raw SVG or palette changes — no network call.
  useEffect(() => {
    if (!rawSvg) return;

    const isNonDefault = colorPalette.id !== "default";
    let svg = rawSvg;

    if (isNonDefault) {
      if (bannerType === "contributions") {
        svg = applyPaletteToContribSvg(
          rawSvg,
          colorPalette.colors,
          bannerTheme,
        );
      } else if (bannerType === "stats") {
        svg = applyPaletteToStatsSvg(rawSvg, colorPalette.colors, bannerTheme);
      }
      // pinned: no colour substitution
    }

    setProcessedSvg(svg);

    // Revoke the previous blob URL to free memory before creating a new one.
    if (prevObjectUrlRef.current) {
      URL.revokeObjectURL(prevObjectUrlRef.current);
    }
    const newUrl = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml" }),
    );
    prevObjectUrlRef.current = newUrl;
    setObjectUrl(newUrl);
    setStatus("loaded");
  }, [rawSvg, colorPalette, bannerType, bannerTheme]);

  // Revoke on unmount.
  useEffect(() => {
    return () => {
      if (prevObjectUrlRef.current) {
        URL.revokeObjectURL(prevObjectUrlRef.current);
      }
    };
  }, []);

  return { objectUrl, processedSvg, status };
}

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps {
  processedSvg: string | null;
  params: BannerParams | null;
  onChangeUsername: () => void;
}

const HeaderSection = ({ processedSvg, params, onChangeUsername }: HeaderProps) => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { username } = useDashboard();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(() => {
    if (!processedSvg || !params || isDownloading) return;

    setIsDownloading(true);

    const svgBlob = new Blob([processedSvg], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 1500;
      canvas.height = img.naturalHeight || 500;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(svgUrl);
        setIsDownloading(false);
        return;
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          const url = URL.createObjectURL(pngBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${params.username}-${params.type}-${params.format}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
        setIsDownloading(false);
      }, "image/png");
    };

    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      setIsDownloading(false);
    };

    img.src = svgUrl;
  }, [processedSvg, params, isDownloading]);

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
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onChangeUsername}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Pencil size={13} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Change username</TooltipContent>
            </Tooltip>
          </div>
        )}
        <ThemeToggleBtn />
        <Button
          className="h-full py-3 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 hover:cursor-pointer disabled:opacity-50"
          onClick={handleDownload}
          disabled={!processedSvg || isDownloading}
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

interface MainContentProps {
  objectUrl: string | null;
  status: SvgStatus;
  hasUrl: boolean;
}

const MainContentSection = ({
  objectUrl,
  status,
  hasUrl,
}: MainContentProps) => {
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
        {!hasUrl ? (
          <p className="text-sm text-muted-foreground">
            Enter a GitHub username to generate your banner.
          </p>
        ) : (
          <div className="w-full max-w-4xl">
            {/* Skeleton */}
            {status === "loading" && (
              <div className="w-full aspect-[1500/500] rounded-xl bg-muted animate-pulse flex items-center justify-center">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-muted-foreground"
                />
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div className="w-full aspect-[1500/500] rounded-xl border border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-2">
                <TriangleAlert size={22} className="text-destructive" />
                <p className="text-sm text-destructive">
                  Failed to load banner. Check the username or try again.
                </p>
              </div>
            )}

            {/* Banner — blob URL with colour palette already baked in */}
            {objectUrl && (
              <img
                key={objectUrl}
                src={objectUrl}
                alt="GitHub banner preview"
                className="w-full rounded-xl shadow-lg"
              />
            )}
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
  const { bannerUrl, params } = useBanner();
  const { colorPalette, bannerTheme } = useDashboard();

  const { objectUrl, processedSvg, status } = useSvgBanner(
    bannerUrl,
    params?.type ?? null,
    colorPalette,
    bannerTheme,
  );

  return (
    <div className="flex flex-col h-full w-full">
      <HeaderSection
        processedSvg={processedSvg}
        params={params}
        onChangeUsername={() => setOpenDialoge(true)}
      />
      <MainContentSection
        objectUrl={objectUrl}
        status={status}
        hasUrl={!!bannerUrl}
      />
      <UserNameInputModal open={openDialoge} setOpen={setOpenDialoge} />
    </div>
  );
};

export default AppDashboard;
