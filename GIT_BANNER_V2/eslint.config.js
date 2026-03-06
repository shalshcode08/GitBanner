import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Ignore build output and auto-generated shadcn UI primitives.
  globalIgnores(["dist", "src/components/ui/**"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Context / hook files intentionally export both a Provider component and
      // a useXxx hook from the same file — this is the standard React pattern and
      // does not affect HMR in any meaningful way.
      "react-refresh/only-export-components": "off",
      // setState calls inside async-fetch effects are the correct React pattern
      // for data fetching. The v7 rule is overly broad for async effect usage.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
