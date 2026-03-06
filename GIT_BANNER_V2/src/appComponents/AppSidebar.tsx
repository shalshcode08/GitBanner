import { ArrowLeft, Check, Copy, Link2, Linkedin, Moon, Sun, Twitter } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "../components/ui/sidebar";
import { CreateBtn } from "../utils/createCustomAppBtn";
import { useNavigate } from "react-router";
import { AppRoutes } from "../routes";
import { AppLogo } from "../icons/HeaderIcons";
import { useTheme } from "../context/ThemeProvider";
import { Link } from "react-router";
import { useDashboard, type BannerTheme } from "../context/DashboardContext";
import {
  BANNER_SIZES,
  COLOR_PALETTES,
  type BannerSize,
  type ColorPalette,
} from "../utils/constants";
import { cn } from "../lib/utils";
import { useBanner } from "../hooks/useBanner";
import { getBannerUrl } from "../api/banner";
import { useState, useCallback } from "react";
import { toast } from "sonner";

// ─── Canvas Size ─────────────────────────────────────────────────────────────

const PREVIEW_WIDTH = 48;

const AspectRatioCard = ({
  size,
  selected,
  onClick,
}: {
  size: BannerSize;
  selected: boolean;
  onClick: () => void;
}) => {
  const previewHeight = Math.round(PREVIEW_WIDTH * (size.height / size.width));
  const Icon = size.platform === "twitter" ? Twitter : Linkedin;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex flex-col items-center gap-2.5 p-3 rounded-lg border-2 transition-all cursor-pointer",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/40 hover:bg-muted/50",
      )}
    >
      <div
        className={cn(
          "rounded-sm border transition-colors",
          selected
            ? "bg-primary/20 border-primary/50"
            : "bg-muted border-border",
        )}
        style={{ width: PREVIEW_WIDTH, height: previewHeight }}
      />
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <Icon
            size={11}
            className={selected ? "text-primary" : "text-muted-foreground"}
          />
          <span
            className={cn(
              "text-xs font-medium",
              selected ? "text-primary" : "text-foreground",
            )}
          >
            {size.label}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {size.width} × {size.height}
        </span>
      </div>
    </button>
  );
};

// ─── Banner Theme ─────────────────────────────────────────────────────────────

const BannerThemeToggle = ({
  value,
  onChange,
}: {
  value: BannerTheme;
  onChange: (theme: BannerTheme) => void;
}) => {
  const options: { label: string; value: BannerTheme; Icon: typeof Sun }[] = [
    { label: "Dark", value: "dark", Icon: Moon },
    { label: "Light", value: "light", Icon: Sun },
  ];

  return (
    <div className="flex gap-2 px-1 pt-1">
      {options.map(({ label, value: optVal, Icon }) => (
        <button
          key={optVal}
          onClick={() => onChange(optVal)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border text-xs font-medium transition-all cursor-pointer",
            value === optVal
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-muted-foreground/40 hover:bg-muted/50 text-muted-foreground",
          )}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );
};

// ─── Contribution Colors ──────────────────────────────────────────────────────

const PaletteRow = ({
  palette,
  selected,
  onClick,
}: {
  palette: ColorPalette;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 my-1 rounded-md border transition-all cursor-pointer",
        selected
          ? "bg-sidebar-accent border-sidebar-border"
          : "border-transparent hover:bg-muted/40",
      )}
    >
      <span
        className={cn(
          "text-xs w-16 text-left shrink-0",
          selected ? "text-foreground font-medium" : "text-muted-foreground",
        )}
      >
        {palette.label}
      </span>
      <div className="flex items-center gap-1.5">
        {palette.colors.map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-md shrink-0"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </button>
  );
};

// ─── Share Actions ────────────────────────────────────────────────────────────

import type { BannerParams } from "../api/banner";

const ShareActions = ({ params }: { params: BannerParams | null }) => {
  const [copyMdState, setCopyMdState] = useState<"idle" | "copied">("idle");
  const [copyLinkState, setCopyLinkState] = useState<"idle" | "copied">("idle");

  const handleCopyMarkdown = useCallback(() => {
    if (!params) return;
    const url = getBannerUrl(params);
    const markdown = `[![GitHub Banner](${url})](https://github.com/${params.username})`;
    navigator.clipboard.writeText(markdown).then(() => {
      setCopyMdState("copied");
      toast.success("Markdown copied! Paste it in your GitHub README.");
      setTimeout(() => setCopyMdState("idle"), 2000);
    });
  }, [params]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyLinkState("copied");
      toast.success("Shareable link copied!");
      setTimeout(() => setCopyLinkState("idle"), 2000);
    });
  }, []);

  return (
    <div className="flex gap-2 px-1 pb-1">
      <button
        onClick={handleCopyLink}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border text-xs font-medium transition-all cursor-pointer border-border text-muted-foreground hover:border-muted-foreground/40 hover:bg-muted/50 hover:text-foreground"
      >
        {copyLinkState === "copied" ? <Check size={13} /> : <Link2 size={13} />}
        Copy Link
      </button>
      <button
        onClick={handleCopyMarkdown}
        disabled={!params}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border text-xs font-medium transition-all",
          params
            ? "cursor-pointer border-border text-muted-foreground hover:border-muted-foreground/40 hover:bg-muted/50 hover:text-foreground"
            : "cursor-not-allowed border-border text-muted-foreground/40",
        )}
      >
        {copyMdState === "copied" ? <Check size={13} /> : <Copy size={13} />}
        Copy README
      </button>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const AppSidebar = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    bannerSize,
    setBannerSize,
    colorPalette,
    setColorPalette,
    bannerTheme,
    setBannerTheme,
  } = useDashboard();
  const { params } = useBanner();
  const isPinned = params?.type === "pinned";

  return (
    <Sidebar variant="floating" side="left" className="py-2 pl-4">
      <div className="flex flex-row items-center gap-4 px-2.5 py-2">
        <CreateBtn
          onClick={() => {
            navigate(AppRoutes.Home);
          }}
        >
          <ArrowLeft size={17} />
        </CreateBtn>
        <Link to={AppRoutes.Home} className="mt-[6px]">
          <AppLogo
            fillColor={theme === "dark" ? "#ffffff" : "#232323"}
            height={40}
          />
        </Link>
      </div>

      <SidebarContent>
        {/* Canvas Size */}
        <SidebarGroup>
          <SidebarGroupLabel>Canvas Size</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-2 gap-2 px-1 pt-1">
              {Object.values(BANNER_SIZES).map((size) => (
                <AspectRatioCard
                  key={size.platform}
                  size={size}
                  selected={bannerSize.platform === size.platform}
                  onClick={() => setBannerSize(size)}
                />
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Banner Theme */}
        <SidebarGroup>
          <SidebarGroupLabel>Banner Theme</SidebarGroupLabel>
          <SidebarGroupContent>
            <BannerThemeToggle value={bannerTheme} onChange={setBannerTheme} />
          </SidebarGroupContent>
        </SidebarGroup>

        {!isPinned && (
          <>
            <SidebarSeparator />

            {/* Contribution Colors */}
            <SidebarGroup>
              <SidebarGroupLabel>Color Palette</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="flex flex-col gap-0.5 px-1 pt-1">
                  {COLOR_PALETTES.map((palette) => (
                    <PaletteRow
                      key={palette.id}
                      palette={palette}
                      selected={colorPalette.id === palette.id}
                      onClick={() => setColorPalette(palette)}
                    />
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="mb-2" />
        <ShareActions params={params} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
