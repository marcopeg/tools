import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1/graphql": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/v1\/graphql/, "/v1/graphql"),
        cookieDomainRewrite: {
          "*": "", // Remove the domain from the cookies to pass them along
        },
      },
    },
  },
  // build: {
  //   rollupOptions: {
  //     external: [
  //       "react",
  //       "react-dom",
  //       "@mui/material",
  //       "@emotion/react",
  //       "@emotion/styled",
  //     ],
  //     output: {
  //       globals: {
  //         react: "React",
  //         "react-dom": "ReactDOM",
  //         "@mui/material": "MaterialUI",
  //         "@emotion/react": "emotionReact",
  //         "@emotion/styled": "emotionStyled",
  //       },
  //     },
  //   },
  // },
  // define: {
  //   "process.env.VITE_GRAPHQL_ENDPOINT": JSON.stringify(
  //     process.env.VITE_GRAPHQL_ENDPOINT
  //   ),
  // },
});
