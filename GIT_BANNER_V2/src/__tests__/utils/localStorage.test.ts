import { describe, it, expect } from "vitest";
import { storage } from "../../utils/localStorage";

// jsdom provides localStorage; setup.ts clears it before each test.

describe("storage.get", () => {
  it("returns the default value when the key is absent", () => {
    expect(storage.get("missing", "default")).toBe("default");
  });

  it("returns the stored value when the key exists", () => {
    storage.set("name", "alice");
    expect(storage.get("name", "")).toBe("alice");
  });

  it("returns the default value when the stored entry has expired", () => {
    const expiredItem = JSON.stringify({
      value: "stale",
      expiry: Date.now() - 1000, // 1 second in the past
    });
    localStorage.setItem("expired", expiredItem);

    expect(storage.get("expired", "default")).toBe("default");
  });

  it("removes the key from localStorage after expiry", () => {
    const expiredItem = JSON.stringify({
      value: "stale",
      expiry: Date.now() - 1000,
    });
    localStorage.setItem("expired", expiredItem);

    storage.get("expired", null);
    expect(localStorage.getItem("expired")).toBeNull();
  });

  it("returns the stored value when the TTL has not expired", () => {
    const freshItem = JSON.stringify({
      value: "fresh",
      expiry: Date.now() + 60_000,
    });
    localStorage.setItem("fresh", freshItem);

    expect(storage.get("fresh", "default")).toBe("fresh");
  });

  it("returns the default value on corrupt JSON", () => {
    localStorage.setItem("corrupt", "not-valid-json");
    expect(storage.get("corrupt", "fallback")).toBe("fallback");
  });

  it("works with non-string types", () => {
    storage.set("count", 42);
    expect(storage.get("count", 0)).toBe(42);
  });
});

describe("storage.set", () => {
  it("stores a value retrievable by .get", () => {
    storage.set("key", "value");
    expect(storage.get("key", "")).toBe("value");
  });

  it("overwrites an existing entry", () => {
    storage.set("key", "old");
    storage.set("key", "new");
    expect(storage.get("key", "")).toBe("new");
  });

  it("stores an expiry in the future by default", () => {
    storage.set("key", "value");
    const raw = JSON.parse(localStorage.getItem("key")!);
    expect(raw.expiry).toBeGreaterThan(Date.now());
  });

  it("handles objects", () => {
    storage.set("obj", { a: 1, b: "two" });
    expect(storage.get("obj", {})).toEqual({ a: 1, b: "two" });
  });
});

describe("storage.has", () => {
  it("returns false when the key is absent", () => {
    expect(storage.has("missing")).toBe(false);
  });

  it("returns true when the key exists (even if expired)", () => {
    localStorage.setItem("exists", "raw");
    expect(storage.has("exists")).toBe(true);
  });
});

describe("storage.remove", () => {
  it("removes an existing key", () => {
    storage.set("key", "value");
    storage.remove("key");
    expect(storage.get("key", "default")).toBe("default");
  });

  it("does not throw when removing a non-existent key", () => {
    expect(() => storage.remove("no-such-key")).not.toThrow();
  });
});

describe("storage.clear", () => {
  it("removes all keys", () => {
    storage.set("a", 1);
    storage.set("b", 2);
    storage.clear();
    expect(storage.get("a", null)).toBeNull();
    expect(storage.get("b", null)).toBeNull();
  });
});

describe("storage.getRaw / setRaw", () => {
  it("setRaw stores a plain string", () => {
    storage.setRaw("raw", "plain");
    expect(localStorage.getItem("raw")).toBe("plain");
  });

  it("getRaw returns the plain string", () => {
    localStorage.setItem("raw", "hello");
    expect(storage.getRaw("raw")).toBe("hello");
  });

  it("getRaw returns null for missing keys", () => {
    expect(storage.getRaw("missing")).toBeNull();
  });
});
