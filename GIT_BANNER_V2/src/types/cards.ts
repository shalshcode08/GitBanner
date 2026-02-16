export interface CardMeta {
  title: string;
  description: string;
  image: string;
  link: string;
}

export const CardsType = {
  GIT_CONTRIBUTION_CARD: "github_contribution_card",
  GIT_PINNED_REPOS_CARD: "github_pinned_repos_card",
  GIT_STATS_CARD: "github_stats_card",
} as const;
