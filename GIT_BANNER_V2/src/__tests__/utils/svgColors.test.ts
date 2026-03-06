import { describe, it, expect } from "vitest";
import {
  CONTRIB_SOURCE_DARK,
  CONTRIB_SOURCE_LIGHT,
  applyPaletteToContribSvg,
  applyPaletteToStatsSvg,
} from "../../utils/svgColors";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

// Minimal SVG that contains all 5 dark contribution cell colors.
const makeContribSvg = (theme: "dark" | "light") => {
  const colors = theme === "dark" ? CONTRIB_SOURCE_DARK : CONTRIB_SOURCE_LIGHT;
  return colors.map((c) => `<rect fill="${c}"/>`).join("\n");
};

const RED_PALETTE = ["#1c1010", "#6b1c1c", "#9b2626", "#c93636", "#ef4444"];

const DARK_STATS_SVG = `
<path fill="#8b949e"/>
<text fill="#e6edf3">1.2k</text>
<text fill="#8b949e">Total Stars</text>
`;

const LIGHT_STATS_SVG = `
<path fill="#656d76"/>
<text fill="#1f2328">1.2k</text>
<text fill="#656d76">Total Stars</text>
`;

// ─── applyPaletteToContribSvg ─────────────────────────────────────────────────

describe("applyPaletteToContribSvg", () => {
  it("replaces all 5 dark contribution colors", () => {
    const svg = makeContribSvg("dark");
    const result = applyPaletteToContribSvg(svg, RED_PALETTE, "dark");

    RED_PALETTE.forEach((color) => {
      expect(result).toContain(color);
    });
  });

  it("removes all original dark source colors after substitution", () => {
    const svg = makeContribSvg("dark");
    const result = applyPaletteToContribSvg(svg, RED_PALETTE, "dark");

    CONTRIB_SOURCE_DARK.forEach((src) => {
      expect(result).not.toContain(src);
    });
  });

  it("replaces all 5 light contribution colors", () => {
    const svg = makeContribSvg("light");
    const result = applyPaletteToContribSvg(svg, RED_PALETTE, "light");

    RED_PALETTE.forEach((color) => {
      expect(result).toContain(color);
    });
  });

  it("removes all original light source colors after substitution", () => {
    const svg = makeContribSvg("light");
    const result = applyPaletteToContribSvg(svg, RED_PALETTE, "light");

    CONTRIB_SOURCE_LIGHT.forEach((src) => {
      expect(result).not.toContain(src);
    });
  });

  it("returns the SVG unchanged when source and destination colors are identical", () => {
    const darkDefault = [...CONTRIB_SOURCE_DARK];
    const svg = makeContribSvg("dark");
    const result = applyPaletteToContribSvg(svg, darkDefault, "dark");
    expect(result).toBe(svg);
  });

  it("replaces multiple occurrences of the same color", () => {
    const svg = `<rect fill="#21262d"/><rect fill="#21262d"/><rect fill="#39d353"/>`;
    const result = applyPaletteToContribSvg(svg, RED_PALETTE, "dark");

    // #21262d → RED_PALETTE[0], both occurrences replaced
    expect(result).toBe(
      `<rect fill="#1c1010"/><rect fill="#1c1010"/><rect fill="#ef4444"/>`,
    );
  });

  it("does not alter colors that are not in the source palette", () => {
    const svg = `<rect fill="#ff0000"/>${makeContribSvg("dark")}`;
    const result = applyPaletteToContribSvg(svg, RED_PALETTE, "dark");

    expect(result).toContain("#ff0000");
  });
});

// ─── applyPaletteToStatsSvg ───────────────────────────────────────────────────

describe("applyPaletteToStatsSvg", () => {
  it("replaces the dark subtext color (#8b949e) with palette[4]", () => {
    const result = applyPaletteToStatsSvg(DARK_STATS_SVG, RED_PALETTE, "dark");
    expect(result).toContain(RED_PALETTE[4]); // #ef4444
    expect(result).not.toContain("#8b949e");
  });

  it("replaces the light subtext color (#656d76) with palette[4]", () => {
    const result = applyPaletteToStatsSvg(
      LIGHT_STATS_SVG,
      RED_PALETTE,
      "light",
    );
    expect(result).toContain(RED_PALETTE[4]); // #ef4444
    expect(result).not.toContain("#656d76");
  });

  it("leaves stat value text color (#e6edf3) untouched on dark theme", () => {
    const result = applyPaletteToStatsSvg(DARK_STATS_SVG, RED_PALETTE, "dark");
    expect(result).toContain("#e6edf3");
  });

  it("leaves stat value text color (#1f2328) untouched on light theme", () => {
    const result = applyPaletteToStatsSvg(
      LIGHT_STATS_SVG,
      RED_PALETTE,
      "light",
    );
    expect(result).toContain("#1f2328");
  });

  it("returns SVG unchanged when palette[4] matches the source subtext color", () => {
    // Dark subtext is #8b949e — if the palette happens to have the same value,
    // no replacement should occur and the original string is returned as-is.
    const noopPalette = ["#a", "#b", "#c", "#d", "#8b949e"];
    const result = applyPaletteToStatsSvg(DARK_STATS_SVG, noopPalette, "dark");
    expect(result).toBe(DARK_STATS_SVG);
  });

  it("replaces every occurrence of the subtext color", () => {
    // Both the icon path and the label use the same subtext color.
    const result = applyPaletteToStatsSvg(DARK_STATS_SVG, RED_PALETTE, "dark");
    // Count occurrences of the replacement color — should be 2 (icon + label)
    const matches = result.match(new RegExp(RED_PALETTE[4], "g")) ?? [];
    expect(matches.length).toBe(2);
  });

  it("does not alter other colors in the SVG", () => {
    const svg = `<rect fill="#0d1117"/>${DARK_STATS_SVG}`;
    const result = applyPaletteToStatsSvg(svg, RED_PALETTE, "dark");
    expect(result).toContain("#0d1117");
  });
});
