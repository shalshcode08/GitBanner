import { createContext, useCallback, useContext, useState } from "react";
import type React from "react";
import {
  BANNER_SIZES,
  COLOR_PALETTES,
  APP_USERNAME_KEY,
  type BannerSize,
  type ColorPalette,
} from "../utils/constants";
import { storage } from "../utils/localStorage";

export type BannerTheme = "dark" | "light";

interface DashboardContextType {
  username: string;
  setUsername: (username: string) => void;
  bannerSize: BannerSize;
  setBannerSize: (size: BannerSize) => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  bannerTheme: BannerTheme;
  setBannerTheme: (theme: BannerTheme) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [username, setUsernameState] = useState<string>(() =>
    storage.get<string>(APP_USERNAME_KEY, ""),
  );
  const [bannerSize, setBannerSize] = useState<BannerSize>(
    BANNER_SIZES.twitter,
  );
  const [colorPalette, setColorPalette] = useState<ColorPalette>(
    COLOR_PALETTES[0],
  );
  const [bannerTheme, setBannerTheme] = useState<BannerTheme>("dark");

  const setUsername = useCallback((u: string) => {
    storage.set(APP_USERNAME_KEY, u);
    setUsernameState(u);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        username,
        setUsername,
        bannerSize,
        setBannerSize,
        colorPalette,
        setColorPalette,
        bannerTheme,
        setBannerTheme,
      }}
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
