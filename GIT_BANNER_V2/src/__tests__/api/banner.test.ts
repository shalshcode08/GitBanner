import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getBannerUrl,
  BannerApiError,
  validateUsername,
  fetchBannerBlob,
} from "../../api/banner";

// ─── getBannerUrl ─────────────────────────────────────────────────────────────

describe("getBannerUrl", () => {
  it("builds the correct URL with all params", () => {
    const url = getBannerUrl({
      username: "torvalds",
      type: "contributions",
      format: "twitter",
      theme: "dark",
    });

    expect(url).toBe(
      "https://git-banner-prod.up.railway.app/banner/torvalds?type=contributions&format=twitter&theme=dark",
    );
  });

  it("includes all three query params", () => {
    const url = new URL(
      getBannerUrl({
        username: "octocat",
        type: "pinned",
        format: "linkedin",
        theme: "light",
      }),
    );

    expect(url.searchParams.get("type")).toBe("pinned");
    expect(url.searchParams.get("format")).toBe("linkedin");
    expect(url.searchParams.get("theme")).toBe("light");
  });

  it("URL-encodes special characters in username", () => {
    // GitHub usernames are alphanumeric + hyphens only, but the function
    // should still safely encode anything passed to it.
    const url = getBannerUrl({
      username: "user name",
      type: "stats",
      format: "twitter",
      theme: "dark",
    });

    expect(url).toContain("/banner/user%20name");
  });

  it("uses stats as the default type when called with stats", () => {
    const url = new URL(
      getBannerUrl({
        username: "octocat",
        type: "stats",
        format: "twitter",
        theme: "dark",
      }),
    );

    expect(url.searchParams.get("type")).toBe("stats");
  });

  it("path always starts with /banner/", () => {
    const url = new URL(
      getBannerUrl({
        username: "octocat",
        type: "stats",
        format: "twitter",
        theme: "dark",
      }),
    );

    expect(url.pathname).toMatch(/^\/banner\//);
  });
});

// ─── BannerApiError ───────────────────────────────────────────────────────────

describe("BannerApiError", () => {
  it("is an instance of Error", () => {
    const err = new BannerApiError("not found", 404);
    expect(err).toBeInstanceOf(Error);
  });

  it("has the name BannerApiError", () => {
    const err = new BannerApiError("not found", 404);
    expect(err.name).toBe("BannerApiError");
  });

  it("stores the status code", () => {
    const err = new BannerApiError("unauthorized", 401);
    expect(err.status).toBe(401);
  });

  it("stores the message", () => {
    const err = new BannerApiError("something went wrong", 502);
    expect(err.message).toBe("something went wrong");
  });
});

// ─── validateUsername ─────────────────────────────────────────────────────────

describe("validateUsername", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  const mockFetch = (status: number, body = "") => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(body, { status }));
  };

  it("returns null when the API responds with 200", async () => {
    mockFetch(200);
    expect(await validateUsername("torvalds")).toBeNull();
  });

  it("returns an error message on 400", async () => {
    mockFetch(400);
    expect(await validateUsername("bad username")).toBe(
      "Invalid GitHub username.",
    );
  });

  it("returns an error message on 401", async () => {
    mockFetch(401);
    expect(await validateUsername("torvalds")).toBe(
      "API authentication error. Try again later.",
    );
  });

  it("returns a not-found message on 404", async () => {
    mockFetch(404);
    const result = await validateUsername("nobody");
    expect(result).toContain("nobody");
    expect(result).toContain("not found");
  });

  it("returns a rate-limit message on 429", async () => {
    mockFetch(429);
    expect(await validateUsername("torvalds")).toBe(
      "Too many requests. Please wait a moment.",
    );
  });

  it("returns a generic message on other errors", async () => {
    mockFetch(502);
    expect(await validateUsername("torvalds")).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("returns null when the request is aborted", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(
      Object.assign(new Error("Aborted"), { name: "AbortError" }),
    );
    const controller = new AbortController();
    expect(await validateUsername("torvalds", controller.signal)).toBeNull();
  });

  it("returns a network error message on fetch failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network down"));
    expect(await validateUsername("torvalds")).toBe(
      "Network error. Check your connection.",
    );
  });

  it("calls the correct endpoint", async () => {
    mockFetch(200);
    await validateUsername("octocat");

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("/banner/octocat");
  });
});

// ─── fetchBannerBlob ──────────────────────────────────────────────────────────

describe("fetchBannerBlob", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  const params = {
    username: "torvalds",
    type: "contributions" as const,
    format: "twitter" as const,
    theme: "dark" as const,
  };

  it("returns a Blob on a successful response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("<svg/>", { status: 200 }),
    );

    const blob = await fetchBannerBlob(params);
    // jsdom's Blob lives in a different class realm than the global Node Blob,
    // so toBeInstanceOf(Blob) fails across environments. Check the interface instead.
    expect(blob.constructor.name).toBe("Blob");
    expect(blob.size).toBeGreaterThan(0);
    expect(typeof blob.text).toBe("function");
  });

  it("throws BannerApiError on a non-OK response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("user not found", { status: 404 }),
    );

    await expect(fetchBannerBlob(params)).rejects.toBeInstanceOf(
      BannerApiError,
    );
  });

  it("BannerApiError carries the HTTP status", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("gateway error", { status: 502 }),
    );

    try {
      await fetchBannerBlob(params);
    } catch (err) {
      expect((err as BannerApiError).status).toBe(502);
    }
  });

  it("passes the abort signal to fetch", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("<svg/>", { status: 200 }),
    );

    const controller = new AbortController();
    await fetchBannerBlob(params, controller.signal);

    const options = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    expect(options.signal).toBe(controller.signal);
  });
});
