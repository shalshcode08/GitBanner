import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { ReactNode } from "react";
import { DashboardProvider } from "../../context/DashboardContext";
import { useBanner } from "../../hooks/useBanner";
import { CardsType } from "../../types/cards";
import { storage } from "../../utils/localStorage";
import { APP_USERNAME_KEY } from "../../utils/constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const seedUsername = (username: string) => {
  storage.set(APP_USERNAME_KEY, username);
};

const makeWrapper =
  (route: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>
      <DashboardProvider>{children}</DashboardProvider>
    </MemoryRouter>
  );

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useBanner", () => {
  it("returns null bannerUrl and params when no username is set", () => {
    const { result } = renderHook(() => useBanner(), {
      wrapper: makeWrapper("/edit?type=github_stats_card"),
    });

    expect(result.current.bannerUrl).toBeNull();
    expect(result.current.params).toBeNull();
  });

  it("returns a bannerUrl when a username is set", () => {
    seedUsername("torvalds");

    const { result } = renderHook(() => useBanner(), {
      wrapper: makeWrapper("/edit?type=github_stats_card"),
    });

    expect(result.current.bannerUrl).not.toBeNull();
    expect(result.current.bannerUrl).toContain("/banner/torvalds");
  });

  it("maps github_contribution_card → type=contributions", () => {
    seedUsername("torvalds");

    const { result } = renderHook(() => useBanner(), {
      wrapper: makeWrapper(`/edit?type=${CardsType.GIT_CONTRIBUTION_CARD}`),
    });

    expect(result.current.bannerUrl).toContain("type=contributions");
    expect(result.current.params?.type).toBe("contributions");
  });

  it("maps github_pinned_repos_card → type=pinned", () => {
    seedUsername("torvalds");

    const { result } = renderHook(() => useBanner(), {
      wrapper: makeWrapper(`/edit?type=${CardsType.GIT_PINNED_REPOS_CARD}`),
    });

    expect(result.current.bannerUrl).toContain("type=pinned");
    expect(result.current.params?.type).toBe("pinned");
  });

  it("maps github_stats_card → type=stats", () => {
    seedUsername("torvalds");

    const { result } = renderHook(() => useBanner(), {
      wrapper: makeWrapper(`/edit?type=${CardsType.GIT_STATS_CARD}`),
    });

    expect(result.current.bannerUrl).toContain("type=stats");
    expect(result.current.params?.type).toBe("stats");
  });

  it("defaults to type=stats for an unrecognised card type", () => {
    seedUsername("torvalds");

    const { result } = renderHook(() => useBanner(), {
      wrapper: makeWrapper("/edit?type=unknown_type"),
    });

    expect(result.current.bannerUrl).toContain("type=stats");
  });

  it("defaults to format=twitter (default bannerSize)", () => {
    seedUsername("torvalds");

    const { result } = renderHook(() => useBanner(), {
      wrapper: makeWrapper("/edit?type=github_stats_card"),
    });

    expect(result.current.bannerUrl).toContain("format=twitter");
    expect(result.current.params?.format).toBe("twitter");
  });

  it("defaults to theme=dark (default bannerTheme)", () => {
    seedUsername("torvalds");

    const { result } = renderHook(() => useBanner(), {
      wrapper: makeWrapper("/edit?type=github_stats_card"),
    });

    expect(result.current.bannerUrl).toContain("theme=dark");
    expect(result.current.params?.theme).toBe("dark");
  });

  it("includes the username in the URL path", () => {
    seedUsername("octocat");

    const { result } = renderHook(() => useBanner(), {
      wrapper: makeWrapper("/edit?type=github_stats_card"),
    });

    expect(result.current.bannerUrl).toContain("/banner/octocat");
    expect(result.current.params?.username).toBe("octocat");
  });
});
