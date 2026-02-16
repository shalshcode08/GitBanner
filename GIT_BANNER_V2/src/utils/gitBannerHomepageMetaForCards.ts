import { AppRoutes } from "../routes";
import { CardsType, type CardMeta } from "../types/cards";

export const GitBannerHomepageMetaForCards: Record<CardsType, CardMeta> = {
  [CardsType.GIT_CONTRIBUTION_CARD]: {
    title: "Github Contributions",
    description: "Generate a banner showcasing your GitHub contributions.",
    image: {
      light: "/assets/cards-banner-img/contributions/contribution_light.png",
      dark: "/assets/cards-banner-img/contributions/contribution_dark.png",
    },
    link: `${AppRoutes.Dashboard}?type=${CardsType.GIT_CONTRIBUTION_CARD}`,
  },
  [CardsType.GIT_PINNED_REPOS_CARD]: {
    title: "Github Pinned Repositories",
    description:
      "Generate a banner showcasing your pinned repositories on GitHub.",
    image: {
      light: "/assets/cards-banner-img/pinned-repos/pinned_light.png",
      dark: "/assets/cards-banner-img/pinned-repos/pinned_dark.png",
    },
    link: `${AppRoutes.Dashboard}?type=${CardsType.GIT_PINNED_REPOS_CARD}`,
  },
  [CardsType.GIT_STATS_CARD]: {
    title: "Github Stats",
    description: "Generate a banner showcasing your GitHub stats.",
    image: {
      light: "/assets/cards-banner-img/stats/stats_light.png",
      dark: "/assets/cards-banner-img/stats/stats_dark.png",
    },
    link: `${AppRoutes.Dashboard}?type=${CardsType.GIT_STATS_CARD}`,
  },
};
