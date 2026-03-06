export const APP_USERNAME_KEY = "username";

export type BannerPlatform = "twitter" | "linkedin";

export interface BannerSize {
  platform: BannerPlatform;
  label: string;
  width: number;
  height: number;
}

export const BANNER_SIZES: Record<BannerPlatform, BannerSize> = {
  twitter: {
    platform: "twitter",
    label: "Twitter / X",
    width: 1500,
    height: 500,
  },
  linkedin: {
    platform: "linkedin",
    label: "LinkedIn",
    width: 1584,
    height: 396,
  },
};

export interface ColorPalette {
  id: string;
  label: string;
  colors: string[];
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "default",
    label: "Default",
    // Matches backend dark-theme hardcoded colors exactly — no substitution applied.
    colors: ["#21262d", "#0e4429", "#006d32", "#26a641", "#39d353"],
  },
  {
    id: "red",
    label: "Red",
    colors: ["#1c1010", "#6b1c1c", "#9b2626", "#c93636", "#ef4444"],
  },
  {
    id: "blue",
    label: "Blue",
    colors: ["#0f172a", "#1e3a8a", "#1d4ed8", "#3b82f6", "#60a5fa"],
  },
  {
    id: "pink",
    label: "Pink",
    colors: ["#1c0f18", "#831843", "#be185d", "#ec4899", "#f9a8d4"],
  },
  {
    id: "violet",
    label: "Violet",
    colors: ["#13111c", "#4c1d95", "#6d28d9", "#8b5cf6", "#c4b5fd"],
  },
  {
    id: "magenta",
    label: "Magenta",
    colors: ["#1c0f1c", "#701a75", "#a21caf", "#d946ef", "#f0abfc"],
  },
  {
    id: "gray",
    label: "Gray",
    colors: ["#111111", "#2d2d2d", "#525252", "#8a8a8a", "#d4d4d4"],
  },
];
