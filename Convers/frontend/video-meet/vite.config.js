// import { defineConfig } from "vite";

// export default defineConfig({
//     server: {
//         host: "0.0.0.0"
//     }
// });

// import { defineConfig } from "vite";
// import basicSsl from "@vitejs/plugin-basic-ssl";

// export default defineConfig({
//   plugins: [basicSsl()],
//   server: {
//     host: "0.0.0.0",
//     https: true
//   }
// });

import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [basicSsl()],

  server: {
    host: "0.0.0.0",
    https: true,

    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      },

      "/signal": {
        target: "http://localhost:8080",
        ws: true,
        changeOrigin: true
      }
    }
  }
});