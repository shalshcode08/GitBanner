import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../../hooks/use-mobile";

const MOBILE_BREAKPOINT = 768;

function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
}

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: { matches: boolean }) => void> = [];
  const mql = {
    matches,
    addEventListener: vi.fn((_: string, cb: (e: { matches: boolean }) => void) => {
      listeners.push(cb);
    }),
    removeEventListener: vi.fn(),
    dispatchChange: (newMatches: boolean) => {
      listeners.forEach((cb) => cb({ matches: newMatches }));
    },
  };
  window.matchMedia = vi.fn().mockReturnValue(mql);
  return mql;
}

describe("useIsMobile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true when window width is below breakpoint", () => {
    setWindowWidth(375);
    mockMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false when window width is at or above breakpoint", () => {
    setWindowWidth(MOBILE_BREAKPOINT);
    mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns false for desktop width", () => {
    setWindowWidth(1440);
    mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("updates when window resizes below breakpoint", () => {
    setWindowWidth(1024);
    const mql = mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      setWindowWidth(375);
      mql.dispatchChange(true);
    });

    expect(result.current).toBe(true);
  });

  it("updates when window resizes above breakpoint", () => {
    setWindowWidth(375);
    const mql = mockMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    act(() => {
      setWindowWidth(1280);
      mql.dispatchChange(false);
    });

    expect(result.current).toBe(false);
  });

  it("removes event listener on unmount", () => {
    setWindowWidth(375);
    const mql = mockMatchMedia(true);

    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    expect(mql.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
