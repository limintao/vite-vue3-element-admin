/*
 * @Author: limit
 * @Date: 2021-08-26 15:50:05
 * @LastEditTime: 2021-09-15 12:23:34
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/vite.config.ts
 * @Description: 由limit创建！
 */
import { defineConfig, loadEnv, ConfigEnv } from "vite";
import { PreRenderedAsset } from "rollup";
import Vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import viteSvgIcons from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) =>
  defineConfig({
    plugins: [
      Vue(),
      vueJsx(),
      viteSvgIcons({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]",
      }),
    ],
    resolve: {
      alias: [
        {
          find: "@",
          replacement: "/src",
        },
        { find: "views", replacement: "/src/views" },
        { find: "components", replacement: "/src/components" },
      ],
    },
    server: {
      proxy: {
        //配置跨域
        [loadEnv(mode, process.cwd()).VITE_APP_BASE_API]: {
          target: loadEnv(mode, process.cwd()).VITE_APP_SERVICE_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(loadEnv(mode, process.cwd()).VITE_APP_BASE_API, ""),
        },
        [loadEnv(mode, process.cwd()).VITE_APP_LIST_API]: {
          target: loadEnv(mode, process.cwd()).VITE_APP_LIST_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(loadEnv(mode, process.cwd()).VITE_APP_LIST_API, ""),
        },
        [loadEnv(mode, process.cwd()).VITE_APP_UPLOAD_API]: {
          target: loadEnv(mode, process.cwd()).VITE_APP_UPLOAD_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(loadEnv(mode, process.cwd()).VITE_APP_UPLOAD_API, ""),
        },
        [loadEnv(mode, process.cwd()).VITE_APP_PARTY_API]: {
          target: loadEnv(mode, process.cwd()).VITE_APP_PARTY_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(loadEnv(mode, process.cwd()).VITE_APP_PARTY_API, ""),
        },
      },
    },
    build: {
      brotliSize: false,
      assetsDir: "static/img/",
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: (assetInfo: PreRenderedAsset) => {
            const suffixArr = assetInfo.name?.split(".") ?? [""];
            const suffix = suffixArr[suffixArr.length - 1]?.toLowerCase();
            const fonts = ["eot", "ttf", "ttc", "woff", "otf"];
            const images = ["bmp", "jpeg", "png", "jpg", "webp", "gif"];
            if (fonts.includes(suffix))
              return "static/fonts/[name]-[hash].[ext]";
            if (images.includes(suffix))
              return "static/images/[name]-[hash].[ext]";
            if (suffix == "css") return "static/css/[name]-[hash].[ext]";
            return "static/other/[name]-[hash].[ext]";
          },
        },
      },
    },
  });
