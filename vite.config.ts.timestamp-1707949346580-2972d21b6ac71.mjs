// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/Documents/WebsitesPrograms/School/CS322/interpreter/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Documents/WebsitesPrograms/School/CS322/interpreter/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/Documents/WebsitesPrograms/School/CS322/interpreter/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { quasar, transformAssetUrls } from "file:///D:/Documents/WebsitesPrograms/School/CS322/interpreter/node_modules/@quasar/vite-plugin/src/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/Documents/WebsitesPrograms/School/CS322/interpreter/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vueJsx(),
    quasar({
      sassVariables: "src/quasar-variables.sass"
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEb2N1bWVudHNcXFxcV2Vic2l0ZXNQcm9ncmFtc1xcXFxTY2hvb2xcXFxcQ1MzMjJcXFxcaW50ZXJwcmV0ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERvY3VtZW50c1xcXFxXZWJzaXRlc1Byb2dyYW1zXFxcXFNjaG9vbFxcXFxDUzMyMlxcXFxpbnRlcnByZXRlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRG9jdW1lbnRzL1dlYnNpdGVzUHJvZ3JhbXMvU2Nob29sL0NTMzIyL2ludGVycHJldGVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB7IHF1YXNhciwgdHJhbnNmb3JtQXNzZXRVcmxzIH0gZnJvbSAnQHF1YXNhci92aXRlLXBsdWdpbidcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoe1xuICAgICAgdGVtcGxhdGU6IHsgdHJhbnNmb3JtQXNzZXRVcmxzIH1cbiAgICB9KSxcbiAgICB2dWVKc3goKSxcbiAgICBxdWFzYXIoe1xuICAgICAgc2Fzc1ZhcmlhYmxlczogJ3NyYy9xdWFzYXItdmFyaWFibGVzLnNhc3MnXG4gICAgfSlcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1csU0FBUyxlQUFlLFdBQVc7QUFFblksU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixTQUFTLFFBQVEsMEJBQTBCO0FBTG9MLElBQU0sMkNBQTJDO0FBUWhSLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFVBQVUsRUFBRSxtQkFBbUI7QUFBQSxJQUNqQyxDQUFDO0FBQUEsSUFDRCxPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsSUFDakIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
