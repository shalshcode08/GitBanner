import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { useDashboard } from "../context/DashboardContext";
import { getBannerUrl, type ApiBannerType, type BannerParams } from "../api/banner";
import { CardsType } from "../types/cards";

// Maps the ?type= URL param (set by the home page cards) to the backend API type.
const CARD_TO_API_TYPE: Record<string, ApiBannerType> = {
  [CardsType.GIT_CONTRIBUTION_CARD]: "contributions",
  [CardsType.GIT_PINNED_REPOS_CARD]: "pinned",
  [CardsType.GIT_STATS_CARD]: "stats",
};

export interface UseBannerResult {
  /** Full URL for the banner SVG — pass directly to <img src>. Null if no username set. */
  bannerUrl: string | null;
  /** Resolved params used to build the URL. Null if no username set. */
  params: BannerParams | null;
}

/**
 * Derives the current banner URL from context (username, bannerSize, bannerTheme)
 * and the ?type= search param set when navigating from the home page.
 *
 * The returned URL points to the backend SVG endpoint. Because the backend sends
 * Cache-Control: public, max-age=300, the browser caches it automatically — no
 * client-side caching layer is needed.
 */
export function useBanner(): UseBannerResult {
  const { bannerSize, bannerTheme, username } = useDashboard();
  const [searchParams] = useSearchParams();

  const apiType: ApiBannerType = useMemo(() => {
    const cardType = searchParams.get("type") ?? "";
    return CARD_TO_API_TYPE[cardType] ?? "stats";
  }, [searchParams]);

  const params: BannerParams | null = useMemo(() => {
    if (!username) return null;
    return {
      username,
      type: apiType,
      format: bannerSize.platform,
      theme: bannerTheme,
    };
  }, [username, apiType, bannerSize.platform, bannerTheme]);

  const bannerUrl = useMemo(() => {
    if (!params) return null;
    return getBannerUrl(params);
  }, [params]);

  return { bannerUrl, params };
}
