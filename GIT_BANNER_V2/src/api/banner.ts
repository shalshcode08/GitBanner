const BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://git-banner-prod.up.railway.app"
).replace(/\/$/, "");

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiBannerType = "stats" | "contributions" | "pinned";
export type ApiBannerFormat = "twitter" | "linkedin";
export type ApiBannerTheme = "dark" | "light";

export interface BannerParams {
  username: string;
  type: ApiBannerType;
  format: ApiBannerFormat;
  theme: ApiBannerTheme;
}

// ─── Error ────────────────────────────────────────────────────────────────────

export class BannerApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BannerApiError";
    this.status = status;
  }
}

// ─── URL builder ─────────────────────────────────────────────────────────────

/**
 * Constructs the full banner image URL.
 * The response is an SVG — use directly as <img src> for zero-overhead display
 * with native browser caching (backend sends Cache-Control: public, max-age=300).
 */
export function getBannerUrl(params: BannerParams): string {
  const { username, type, format, theme } = params;
  const url = new URL(`/banner/${encodeURIComponent(username)}`, BASE_URL);
  url.searchParams.set("type", type);
  url.searchParams.set("format", format);
  url.searchParams.set("theme", theme);
  return url.toString();
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validates a GitHub username by hitting the live API.
 * Returns null on success, or a user-facing error string.
 *
 * Uses a stats+twitter+dark request as the cheapest possible probe —
 * the backend caches results for 5 minutes so repeated calls are free.
 */
export async function validateUsername(
  username: string,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const url = getBannerUrl({
      username,
      type: "stats",
      format: "twitter",
      theme: "dark",
    });

    const res = await fetch(url, { signal });

    if (res.status === 400) return "Invalid GitHub username.";
    if (res.status === 401) return "API authentication error. Try again later.";
    if (res.status === 404) return `GitHub user "${username}" not found.`;
    if (res.status === 429) return "Too many requests. Please wait a moment.";
    if (!res.ok) return "Something went wrong. Please try again.";

    return null;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return null;
    return "Network error. Check your connection.";
  }
}

// ─── Download ─────────────────────────────────────────────────────────────────

/**
 * Fetches the banner SVG as a Blob, suitable for triggering a file download.
 */
export async function fetchBannerBlob(
  params: BannerParams,
  signal?: AbortSignal,
): Promise<Blob> {
  const res = await fetch(getBannerUrl(params), { signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new BannerApiError(text.trim(), res.status);
  }
  return res.blob();
}
