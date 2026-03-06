import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  DashboardProvider,
  useDashboard,
} from "../../context/DashboardContext";
import {
  BANNER_SIZES,
  COLOR_PALETTES,
  APP_USERNAME_KEY,
} from "../../utils/constants";
import { storage } from "../../utils/localStorage";

const wrapper = ({ children }: { children: ReactNode }) => (
  <DashboardProvider>{children}</DashboardProvider>
);

describe("useDashboard", () => {
  it("throws when used outside DashboardProvider", () => {
    expect(() => renderHook(() => useDashboard())).toThrow(
      "useDashboard must be used within a DashboardProvider",
    );
  });

  it("provides empty username by default when localStorage is empty", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.username).toBe("");
  });

  it("initialises username from localStorage", () => {
    storage.set(APP_USERNAME_KEY, "torvalds");

    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.username).toBe("torvalds");
  });

  it("setUsername updates the username in context", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });

    act(() => {
      result.current.setUsername("octocat");
    });

    expect(result.current.username).toBe("octocat");
  });

  it("setUsername persists the value to localStorage", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });

    act(() => {
      result.current.setUsername("octocat");
    });

    expect(storage.get(APP_USERNAME_KEY, "")).toBe("octocat");
  });

  it("defaults bannerSize to twitter", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.bannerSize).toEqual(BANNER_SIZES.twitter);
  });

  it("setBannerSize updates the banner size", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });

    act(() => {
      result.current.setBannerSize(BANNER_SIZES.linkedin);
    });

    expect(result.current.bannerSize).toEqual(BANNER_SIZES.linkedin);
  });

  it("defaults bannerTheme to dark", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.bannerTheme).toBe("dark");
  });

  it("setBannerTheme updates the theme", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });

    act(() => {
      result.current.setBannerTheme("light");
    });

    expect(result.current.bannerTheme).toBe("light");
  });

  it("defaults colorPalette to the first palette", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.colorPalette).toEqual(COLOR_PALETTES[0]);
  });

  it("setColorPalette updates the palette", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    const newPalette = COLOR_PALETTES[2];

    act(() => {
      result.current.setColorPalette(newPalette);
    });

    expect(result.current.colorPalette).toEqual(newPalette);
  });
});
