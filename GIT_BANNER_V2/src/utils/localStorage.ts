export type StoredValue<T> = {
  value: T;
  expiry?: number;
};

const isBrowser = typeof window !== "undefined";
const DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000;

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (!isBrowser) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsed: StoredValue<T> = JSON.parse(item);

      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return defaultValue;
      }

      return parsed.value;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T, ttl: number = DEFAULT_TTL) {
    if (!isBrowser) return;

    try {
      const data: StoredValue<T> = {
        value,
        expiry: ttl ? Date.now() + ttl : undefined,
      };

      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("LocalStorage set error:", error);
    }
  },

  getRaw(key: string): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(key);
  },

  setRaw(key: string, value: string) {
    if (!isBrowser) return;
    localStorage.setItem(key, value);
  },

  has(key: string): boolean {
    if (!isBrowser) return false;
    return localStorage.getItem(key) !== null;
  },

  remove(key: string) {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },

  clear() {
    if (!isBrowser) return;
    localStorage.clear();
  },
};
