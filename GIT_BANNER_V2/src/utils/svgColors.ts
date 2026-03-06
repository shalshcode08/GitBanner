// ─── Contributions ────────────────────────────────────────────────────────────

/**
 * Contribution cell colors the backend hardcodes in its SVG output.
 * Source: internal/banner/contributions.go — contribCellColor()
 * Order: [empty, low, medium, high, max]
 */
export const CONTRIB_SOURCE_DARK = [
  "#21262d", // 0 contributions
  "#0e4429", // 1–4
  "#006d32", // 5–14
  "#26a641", // 15–29
  "#39d353", // 30+
] as const;

export const CONTRIB_SOURCE_LIGHT = [
  "#ebedf0",
  "#9be9a8",
  "#40c463",
  "#30a14e",
  "#216e39",
] as const;

/**
 * Replaces all 5 contribution cell shades with the chosen palette colors.
 * Only call this for type=contributions banners.
 */
export function applyPaletteToContribSvg(
  svgText: string,
  paletteColors: string[],
  bannerTheme: "dark" | "light",
): string {
  const source =
    bannerTheme === "dark" ? CONTRIB_SOURCE_DARK : CONTRIB_SOURCE_LIGHT;

  let result = svgText;

  source.forEach((src, i) => {
    const dst = paletteColors[i]?.toLowerCase();
    if (dst && src !== dst) {
      result = result.replaceAll(src, dst);
    }
  });

  return result;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

/**
 * The C.Subtext palette token the backend uses in the stats SVG:
 *   - stat tile icons (SVG path fill)
 *   - stat tile labels ("Repositories", "Total Stars", …)
 *
 * Source: internal/banner/banner.go — PaletteFor()
 */
const STATS_SUBTEXT_DARK = "#8b949e";
const STATS_SUBTEXT_LIGHT = "#656d76";

/**
 * Applies a subtle palette tint to the stats banner by replacing only the
 * subtext color (icons + labels) with the palette's most vivid shade (index 4).
 *
 * Stat value numbers, @username, backgrounds, and borders are left untouched
 * so the change reads as an accent rather than a full re-theme.
 */
export function applyPaletteToStatsSvg(
  svgText: string,
  paletteColors: string[],
  bannerTheme: "dark" | "light",
): string {
  const src = bannerTheme === "dark" ? STATS_SUBTEXT_DARK : STATS_SUBTEXT_LIGHT;
  const dst = paletteColors[4]?.toLowerCase(); // most vibrant shade

  if (!dst || src === dst) return svgText;

  return svgText.replaceAll(src, dst);
}
