import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  getBannerUrl,
  BannerApiError,
  validateUsername,
  fetchBannerBlob,
} from "../../api/banner";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

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
    vi.clearAllMocks();
  });

  const mockSuccess = () => {
    mockedAxios.get.mockResolvedValueOnce({ data: "<svg/>", status: 200 });
  };

  const mockAxiosError = (status: number) => {
    const err = Object.assign(new Error(`HTTP ${status}`), {
      isAxiosError: true,
      response: { status },
    });
    mockedAxios.get.mockRejectedValueOnce(err);
    mockedAxios.isAxiosError.mockReturnValueOnce(true);
    mockedAxios.isCancel.mockReturnValueOnce(false);
  };

  const mockNetworkError = () => {
    const err = Object.assign(new Error("Network Error"), {
      isAxiosError: true,
      response: undefined,
    });
    mockedAxios.get.mockRejectedValueOnce(err);
    mockedAxios.isAxiosError.mockReturnValueOnce(true);
    mockedAxios.isCancel.mockReturnValueOnce(false);
  };

  const mockCancelError = () => {
    const err = new Error("canceled");
    mockedAxios.get.mockRejectedValueOnce(err);
    mockedAxios.isCancel.mockReturnValueOnce(true);
  };

  it("returns null when the API responds with 200", async () => {
    mockSuccess();
    expect(await validateUsername("torvalds")).toBeNull();
  });

  it("returns an error message on 400", async () => {
    mockAxiosError(400);
    expect(await validateUsername("bad username")).toBe(
      "Invalid GitHub username.",
    );
  });

  it("returns an error message on 401", async () => {
    mockAxiosError(401);
    expect(await validateUsername("torvalds")).toBe(
      "API authentication error. Try again later.",
    );
  });

  it("returns a not-found message on 404", async () => {
    mockAxiosError(404);
    const result = await validateUsername("nobody");
    expect(result).toContain("nobody");
    expect(result).toContain("not found");
  });

  it("returns a rate-limit message on 429", async () => {
    mockAxiosError(429);
    expect(await validateUsername("torvalds")).toBe(
      "Too many requests. Please wait a moment.",
    );
  });

  it("returns a generic message on other errors", async () => {
    mockAxiosError(502);
    expect(await validateUsername("torvalds")).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("returns null when the request is cancelled", async () => {
    mockCancelError();
    const controller = new AbortController();
    expect(await validateUsername("torvalds", controller.signal)).toBeNull();
  });

  it("returns a network error message on no response", async () => {
    mockNetworkError();
    expect(await validateUsername("torvalds")).toBe(
      "Network error. Check your connection.",
    );
  });

  it("calls the correct endpoint", async () => {
    mockSuccess();
    await validateUsername("octocat");

    const calledUrl = mockedAxios.get.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/banner/octocat");
  });
});

// ─── fetchBannerBlob ──────────────────────────────────────────────────────────

describe("fetchBannerBlob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const params = {
    username: "torvalds",
    type: "contributions" as const,
    format: "twitter" as const,
    theme: "dark" as const,
  };

  it("returns a Blob on a successful response", async () => {
    const blob = new Blob(["<svg/>"], { type: "image/svg+xml" });
    mockedAxios.get.mockResolvedValueOnce({ data: blob, status: 200 });

    const result = await fetchBannerBlob(params);
    expect(result.constructor.name).toBe("Blob");
    expect(result.size).toBeGreaterThan(0);
    expect(typeof result.text).toBe("function");
  });

  it("passes the abort signal to axios", async () => {
    const blob = new Blob(["<svg/>"], { type: "image/svg+xml" });
    mockedAxios.get.mockResolvedValueOnce({ data: blob, status: 200 });

    const controller = new AbortController();
    await fetchBannerBlob(params, controller.signal);

    const options = mockedAxios.get.mock.calls[0][1];
    expect(options?.signal).toBe(controller.signal);
  });

  it("uses responseType blob", async () => {
    const blob = new Blob(["<svg/>"], { type: "image/svg+xml" });
    mockedAxios.get.mockResolvedValueOnce({ data: blob, status: 200 });

    await fetchBannerBlob(params);

    const options = mockedAxios.get.mock.calls[0][1];
    expect(options?.responseType).toBe("blob");
  });
});
