// vite.config.ts
import { loadEnv } from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/vite/dist/node/index.js";
import Vue from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueJsx from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import UnoCSS from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/unplugin-vue-components/dist/resolvers.js";
import { createHtmlPlugin } from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/vite-plugin-html/dist/index.mjs";
import { visualizer } from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import viteCompression from "file:///D:/work20240226/rcs-20250311/gaode-20260209/node_modules/vite-plugin-compression/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "D:\\work20240226\\rcs-20250311\\gaode-20260209";
var vite_config_default = ({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const isBuild = mode === "production" || mode === "prod";
  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      Vue(),
      VueJsx(),
      UnoCSS(),
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          "pinia",
          {
            "vue-i18n": ["useI18n"]
          }
        ],
        dts: "src/types/auto-imports.d.ts",
        eslintrc: {
          enabled: false
        }
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: "src/types/components.d.ts",
        extensions: ["vue", "tsx"],
        include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\\.git[\\/]/, /[\\/]\\.nuxt[\\/]/]
      }),
      createHtmlPlugin({
        minify: true,
        template: "index.html"
      }),
      // Gzip 压缩
      viteCompression({
        verbose: true,
        disable: !isBuild,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz"
      }),
      // 打包体积分析
      isBuild && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: "dist/stats.html"
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      },
      optimizeDeps: {
        include: ["vue", "vue-router", "pinia", "element-plus", "axios", "dayjs"]
      }
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_PORT) || 5173,
      open: env.VITE_OPEN === "true",
      hmr: {
        overlay: true
      },
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, ""),
          ws: true
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variables.scss" as *;',
          javascriptEnabled: true
        }
      }
    },
    build: {
      target: "es2022",
      outDir: env.VITE_OUT_DIR || "dist",
      assetsDir: "assets",
      sourcemap: env.VITE_SOURCEMAP === "true",
      minify: "terser",
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: "[ext]/[name]-[hash].[ext]",
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("vue")) {
                return "vue-vendor";
              }
              if (id.includes("vue-router")) {
                return "vue-router";
              }
              if (id.includes("pinia")) {
                return "pinia";
              }
              if (id.includes("element-plus") || id.includes("@element-plus")) {
                return "element-plus";
              }
              if (id.includes("vue-i18n") || id.includes("@intlify")) {
                return "i18n";
              }
              return "vendor";
            }
          }
        }
      },
      chunkSizeWarningLimit: 1e3
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3JrMjAyNDAyMjZcXFxccmNzLTIwMjUwMzExXFxcXGdhb2RlLTIwMjYwMjA5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx3b3JrMjAyNDAyMjZcXFxccmNzLTIwMjUwMzExXFxcXGdhb2RlLTIwMjYwMjA5XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi93b3JrMjAyNDAyMjYvcmNzLTIwMjUwMzExL2dhb2RlLTIwMjYwMjA5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgbG9hZEVudiwgdHlwZSBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgVnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbidcbmltcG9ydCB7IENvbmZpZ0VudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiBDb25maWdFbnYpID0+IHtcbiAgY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKClcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCByb290KVxuICBjb25zdCBpc0J1aWxkID0gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nIHx8IG1vZGUgPT09ICdwcm9kJ1xuXG4gIHJldHVybiB7XG4gICAgYmFzZTogZW52LlZJVEVfQkFTRV9QQVRILFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIFZ1ZSgpLFxuICAgICAgVnVlSnN4KCksXG4gICAgICBVbm9DU1MoKSxcbiAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICBpbXBvcnRzOiBbXG4gICAgICAgICAgJ3Z1ZScsXG4gICAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAgICdwaW5pYScsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ3Z1ZS1pMThuJzogWyd1c2VJMThuJ11cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9hdXRvLWltcG9ydHMuZC50cycsXG4gICAgICAgIGVzbGludHJjOiB7XG4gICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBDb21wb25lbnRzKHtcbiAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcbiAgICAgICAgZHRzOiAnc3JjL3R5cGVzL2NvbXBvbmVudHMuZC50cycsXG4gICAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ3RzeCddLFxuICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLnRzeCQvXSxcbiAgICAgICAgZXhjbHVkZTogWy9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXS8sIC9bXFxcXC9dXFxcXC5naXRbXFxcXC9dLywgL1tcXFxcL11cXFxcLm51eHRbXFxcXC9dL11cbiAgICAgIH0pLFxuICAgICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgdGVtcGxhdGU6ICdpbmRleC5odG1sJ1xuICAgICAgfSksXG4gICAgICAvLyBHemlwIFx1NTM4Qlx1N0YyOVxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgICAgdmVyYm9zZTogdHJ1ZSxcbiAgICAgICAgZGlzYWJsZTogIWlzQnVpbGQsXG4gICAgICAgIHRocmVzaG9sZDogMTAyNDAsXG4gICAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxuICAgICAgICBleHQ6ICcuZ3onXG4gICAgICB9KSxcbiAgICAgIC8vIFx1NjI1M1x1NTMwNVx1NEY1M1x1NzlFRlx1NTIwNlx1Njc5MFxuICAgICAgaXNCdWlsZCAmJlxuICAgICAgICB2aXN1YWxpemVyKHtcbiAgICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgICAgICAgIGZpbGVuYW1lOiAnZGlzdC9zdGF0cy5odG1sJ1xuICAgICAgICB9KVxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICAgJ3Z1ZS1pMThuJzogJ3Z1ZS1pMThuL2Rpc3QvdnVlLWkxOG4uY2pzLmpzJ1xuICAgICAgfSxcbiAgICAgIG9wdGltaXplRGVwczoge1xuICAgICAgICBpbmNsdWRlOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJywgJ2VsZW1lbnQtcGx1cycsICdheGlvcycsICdkYXlqcyddXG4gICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICAgIHBvcnQ6IE51bWJlcihlbnYuVklURV9QT1JUKSB8fCA1MTczLFxuICAgICAgb3BlbjogZW52LlZJVEVfT1BFTiA9PT0gJ3RydWUnLFxuICAgICAgaG1yOiB7XG4gICAgICAgIG92ZXJsYXk6IHRydWVcbiAgICAgIH0sXG4gICAgICBwcm94eToge1xuICAgICAgICAnL2FwaSc6IHtcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX0FQSV9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICAgICAgd3M6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogJ0B1c2UgXCJAL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7JyxcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDIyJyxcbiAgICAgIG91dERpcjogZW52LlZJVEVfT1VUX0RJUiB8fCAnZGlzdCcsXG4gICAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgICAgc291cmNlbWFwOiBlbnYuVklURV9TT1VSQ0VNQVAgPT09ICd0cnVlJyxcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogJ1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF0nLFxuICAgICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygndnVlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3Z1ZS12ZW5kb3InXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd2dWUtcm91dGVyJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3Z1ZS1yb3V0ZXInXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdwaW5pYScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdwaW5pYSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2VsZW1lbnQtcGx1cycpIHx8IGlkLmluY2x1ZGVzKCdAZWxlbWVudC1wbHVzJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2VsZW1lbnQtcGx1cydcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3Z1ZS1pMThuJykgfHwgaWQuaW5jbHVkZXMoJ0BpbnRsaWZ5JykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2kxOG4nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwXG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJULFNBQVMsZUFBa0M7QUFDdFcsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxxQkFBcUI7QUFFNUIsT0FBTyxVQUFVO0FBWGpCLElBQU0sbUNBQW1DO0FBY3pDLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBaUI7QUFDdEMsUUFBTSxPQUFPLFFBQVEsSUFBSTtBQUN6QixRQUFNLE1BQU0sUUFBUSxNQUFNLElBQUk7QUFDOUIsUUFBTSxVQUFVLFNBQVMsZ0JBQWdCLFNBQVM7QUFFbEQsU0FBTztBQUFBLElBQ0wsTUFBTSxJQUFJO0FBQUEsSUFDVixTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixPQUFPO0FBQUEsTUFDUCxPQUFPO0FBQUEsTUFDUCxXQUFXO0FBQUEsUUFDVCxTQUFTO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFlBQ0UsWUFBWSxDQUFDLFNBQVM7QUFBQSxVQUN4QjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLEtBQUs7QUFBQSxRQUNMLFVBQVU7QUFBQSxVQUNSLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRixDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxRQUNqQyxLQUFLO0FBQUEsUUFDTCxZQUFZLENBQUMsT0FBTyxLQUFLO0FBQUEsUUFDekIsU0FBUyxDQUFDLFVBQVUsY0FBYyxRQUFRO0FBQUEsUUFDMUMsU0FBUyxDQUFDLDBCQUEwQixvQkFBb0IsbUJBQW1CO0FBQUEsTUFDN0UsQ0FBQztBQUFBLE1BQ0QsaUJBQWlCO0FBQUEsUUFDZixRQUFRO0FBQUEsUUFDUixVQUFVO0FBQUEsTUFDWixDQUFDO0FBQUE7QUFBQSxNQUVELGdCQUFnQjtBQUFBLFFBQ2QsU0FBUztBQUFBLFFBQ1QsU0FBUyxDQUFDO0FBQUEsUUFDVixXQUFXO0FBQUEsUUFDWCxXQUFXO0FBQUEsUUFDWCxLQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUE7QUFBQSxNQUVELFdBQ0UsV0FBVztBQUFBLFFBQ1QsTUFBTTtBQUFBLFFBQ04sVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLFFBQ1osVUFBVTtBQUFBLE1BQ1osQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxRQUNwQyxZQUFZO0FBQUEsTUFDZDtBQUFBLE1BQ0EsY0FBYztBQUFBLFFBQ1osU0FBUyxDQUFDLE9BQU8sY0FBYyxTQUFTLGdCQUFnQixTQUFTLE9BQU87QUFBQSxNQUMxRTtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU0sT0FBTyxJQUFJLFNBQVMsS0FBSztBQUFBLE1BQy9CLE1BQU0sSUFBSSxjQUFjO0FBQUEsTUFDeEIsS0FBSztBQUFBLFFBQ0gsU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVEsSUFBSSxnQkFBZ0I7QUFBQSxVQUM1QixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxVQUM1QyxJQUFJO0FBQUEsUUFDTjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixnQkFBZ0I7QUFBQSxVQUNoQixtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixRQUFRLElBQUksZ0JBQWdCO0FBQUEsTUFDNUIsV0FBVztBQUFBLE1BQ1gsV0FBVyxJQUFJLG1CQUFtQjtBQUFBLE1BQ2xDLFFBQVE7QUFBQSxNQUNSLGNBQWM7QUFBQSxNQUNkLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxVQUNOLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGNBQWMsQ0FBQyxPQUFPO0FBQ3BCLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0Isa0JBQUksR0FBRyxTQUFTLEtBQUssR0FBRztBQUN0Qix1QkFBTztBQUFBLGNBQ1Q7QUFDQSxrQkFBSSxHQUFHLFNBQVMsWUFBWSxHQUFHO0FBQzdCLHVCQUFPO0FBQUEsY0FDVDtBQUNBLGtCQUFJLEdBQUcsU0FBUyxPQUFPLEdBQUc7QUFDeEIsdUJBQU87QUFBQSxjQUNUO0FBQ0Esa0JBQUksR0FBRyxTQUFTLGNBQWMsS0FBSyxHQUFHLFNBQVMsZUFBZSxHQUFHO0FBQy9ELHVCQUFPO0FBQUEsY0FDVDtBQUNBLGtCQUFJLEdBQUcsU0FBUyxVQUFVLEtBQUssR0FBRyxTQUFTLFVBQVUsR0FBRztBQUN0RCx1QkFBTztBQUFBLGNBQ1Q7QUFDQSxxQkFBTztBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLHVCQUF1QjtBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
