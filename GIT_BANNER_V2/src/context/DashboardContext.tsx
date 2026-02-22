import { createContext, useContext, useState } from "react";
import type React from "react";
import {
  BANNER_SIZES,
  COLOR_PALETTES,
  type BannerSize,
  type ColorPalette,
} from "../utils/constants";

interface DashboardContextType {
  bannerSize: BannerSize;
  setBannerSize: (size: BannerSize) => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bannerSize, setBannerSize] = useState<BannerSize>(
    BANNER_SIZES.twitter,
  );
  const [colorPalette, setColorPalette] = useState<ColorPalette>(
    COLOR_PALETTES[0],
  );

  return (
    <DashboardContext.Provider
      value={{ bannerSize, setBannerSize, colorPalette, setColorPalette }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
