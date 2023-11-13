import { resolve } from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        globPatterns: ["**/*.{js,css,png,jpg,svg}"],
      },
      registerType: "autoUpdate",
      manifest: {
        theme_color: "#1E5BB6",
        background_color: "#222222",
        display: "standalone",
        scope: "/",
        start_url: "/",
        name: "TrainIn",
        short_name: "TrainIn",
        description:
          "Aplicativo de treino que permite aos usuários realizar treinos personalizados com metas geradas com base no seu nível de habilidade.",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "pages/home.html"),
        profile: resolve(__dirname, "pages/profile.html"),
        login: resolve(__dirname, "pages/login.html"),
        stats: resolve(__dirname, "pages/stats.html"),
        createProfile: resolve(__dirname, "pages/create-profile.html"),
        leveling: resolve(__dirname, "pages/exercise/leveling.html"),
        sets: resolve(__dirname, "pages/exercise/sets.html"),
        workout: resolve(__dirname, "pages/exercise/workout.html"),
        completed: resolve(__dirname, "pages/exercise/completed.html"),
        navigation: resolve(__dirname, "components/navigation/navigation.html"),
        rep_counter: resolve(__dirname, "components/rep-counter/rep-counter.html"),
      },
    },
  },
});
