import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.REACT_APP_API_URL": JSON.stringify(env.REACT_APP_API_URL),
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react-swc";

// // // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
// const env = loadEnv(mode, process.cwd(), "");
//   return {
//     define: {
//       "process.env.REACT_APP_MAPBOX_ACCESS_TOKEN": JSON.stringify(
//         env.REACT_APP_MAPBOX_ACCESS_TOKEN
//       ),
//       "process.env.REACT_APP_MAPBOX_USERNAME": JSON.stringify(
//         env.REACT_APP_MAPBOX_USERNAME
//       ),
//       "process.env.REACT_APP_MAPBOX_MAPSTYLE": JSON.stringify(
//         env.REACT_APP_MAPBOX_MAPSTYLE
//       ),
//       "process.env.REACT_APP_SHARE_SECRET_KEY": JSON.stringify(
//         env.REACT_APP_SHARE_SECRET_KEY
//       ),
//       "process.env.REACT_APP_API_URL": JSON.stringify(
//         env.REACT_APP_API_URL
//       ),
//       "process.env.CDN_BASE": JSON.stringify(
//         env.CDN_BASE
//       ),
//       "process.env.AZURE_CONTAINER_NAME": JSON.stringify(
//         env.AZURE_CONTAINER_NAME
//       ),
//     },
//     esbuild: {
//       supported: {
//         "top-level-await": true,
//       },
//     },
//     plugins: [react()],
//     optimizeDeps: {
//       force: true,
//     }
//   };
// });
