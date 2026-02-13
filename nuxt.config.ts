import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    port: 4000,
    host: "localhost",
  },
  routeRules: {
    "/**": { isr: true },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/tailwind.css"],
  modules: ["shadcn-nuxt", "@nuxtjs/color-mode"],
  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },
});
