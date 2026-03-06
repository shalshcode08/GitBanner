import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const ASCII_BANNER = `
\x1b[32m\x1b[1m ██████╗ ██╗████████╗██████╗  █████╗ ███╗  ██╗███╗  ██╗███████╗██████╗
██╔════╝ ██║╚══██╔══╝██╔══██╗██╔══██╗████╗ ██║████╗ ██║██╔════╝██╔══██╗
██║  ███╗██║   ██║   ██████╔╝███████║██╔██╗██║██╔██╗██║█████╗  ██████╔╝
██║   ██║██║   ██║   ██╔══██╗██╔══██║██║╚████║██║╚████║██╔══╝  ██╔══██╗
╚██████╔╝██║   ██║   ██████╔╝██║  ██║██║ ╚███║██║ ╚███║███████╗██║  ██║
 ╚═════╝ ╚═╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚══╝╚═╝  ╚══╝╚══════╝╚═╝  ╚═╝\x1b[0m
\x1b[2m  GitHub Profile Banner Generator — Frontend Dev Server\x1b[0m
`;

function asciiPlugin() {
  return {
    name: "gitbanner-ascii",
    configureServer(server: { printUrls: () => void }) {
      const _printUrls = server.printUrls.bind(server);
      server.printUrls = () => {
        process.stdout.write(ASCII_BANNER + "\n");
        _printUrls();
      };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [asciiPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/__tests__/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/__tests__/**",
        "src/components/ui/**",
        "src/main.tsx",
        "src/**/*.d.ts",
      ],
    },
  },
});
