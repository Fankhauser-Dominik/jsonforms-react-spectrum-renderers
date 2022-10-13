// vite.config.ts
import { defineConfig } from "file:///home/fanki/Schreibtisch/Code/Headwire/August/jsonforms-react-spectrum-renderers/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import react from "file:///home/fanki/Schreibtisch/Code/Headwire/August/jsonforms-react-spectrum-renderers/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///home/fanki/Schreibtisch/Code/Headwire/August/jsonforms-react-spectrum-renderers/node_modules/vite-plugin-dts/dist/index.mjs";
import cssInjectedByJsPlugin from "file:///home/fanki/Schreibtisch/Code/Headwire/August/jsonforms-react-spectrum-renderers/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
var __vite_injected_original_dirname = "/home/fanki/Schreibtisch/Code/Headwire/August/jsonforms-react-spectrum-renderers";
var vite_config_default = defineConfig({
  publicDir: false,
  build: {
    minify: false,
    sourcemap: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "JsonForms React Spectrum Renderers",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom", "@jsonforms/core", "@jsonforms/react", "moment"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@jsonforms/core": "@jsonforms/core",
          "@jsonforms/react": "@jsonforms/react",
          moment: "moment"
        }
      }
    }
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    dts({
      insertTypesEntry: true
    })
  ],
  define: {
    "process.platform": null,
    "global.setImmediate": null
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9mYW5raS9TY2hyZWlidGlzY2gvQ29kZS9IZWFkd2lyZS9BdWd1c3QvanNvbmZvcm1zLXJlYWN0LXNwZWN0cnVtLXJlbmRlcmVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZmFua2kvU2NocmVpYnRpc2NoL0NvZGUvSGVhZHdpcmUvQXVndXN0L2pzb25mb3Jtcy1yZWFjdC1zcGVjdHJ1bS1yZW5kZXJlcnMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZmFua2kvU2NocmVpYnRpc2NoL0NvZGUvSGVhZHdpcmUvQXVndXN0L2pzb25mb3Jtcy1yZWFjdC1zcGVjdHJ1bS1yZW5kZXJlcnMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5pbXBvcnQgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLWNzcy1pbmplY3RlZC1ieS1qcyc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwdWJsaWNEaXI6IGZhbHNlLFxuICBidWlsZDoge1xuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgbmFtZTogJ0pzb25Gb3JtcyBSZWFjdCBTcGVjdHJ1bSBSZW5kZXJlcnMnLFxuICAgICAgZm9ybWF0czogWydlcycsICd1bWQnXSxcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgaW5kZXguJHtmb3JtYXR9LmpzYCxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vIG1ha2Ugc3VyZSB0byBleHRlcm5hbGl6ZSBkZXBzIHRoYXQgc2hvdWxkbid0IGJlIGJ1bmRsZWRcbiAgICAgIC8vIGludG8geW91ciBsaWJyYXJ5XG4gICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nLCAnQGpzb25mb3Jtcy9jb3JlJywgJ0Bqc29uZm9ybXMvcmVhY3QnLCAnbW9tZW50J10sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gUHJvdmlkZSBnbG9iYWwgdmFyaWFibGVzIHRvIHVzZSBpbiB0aGUgVU1EIGJ1aWxkXG4gICAgICAgIC8vIGZvciBleHRlcm5hbGl6ZWQgZGVwc1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgcmVhY3Q6ICdSZWFjdCcsXG4gICAgICAgICAgJ3JlYWN0LWRvbSc6ICdSZWFjdERPTScsXG4gICAgICAgICAgJ0Bqc29uZm9ybXMvY29yZSc6ICdAanNvbmZvcm1zL2NvcmUnLFxuICAgICAgICAgICdAanNvbmZvcm1zL3JlYWN0JzogJ0Bqc29uZm9ybXMvcmVhY3QnLFxuICAgICAgICAgIG1vbWVudDogJ21vbWVudCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGNzc0luamVjdGVkQnlKc1BsdWdpbigpLFxuICAgIGR0cyh7XG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgIH0pLFxuICBdLFxuICBkZWZpbmU6IHtcbiAgICAncHJvY2Vzcy5wbGF0Zm9ybSc6IG51bGwsXG4gICAgJ2dsb2JhbC5zZXRJbW1lZGlhdGUnOiBudWxsLFxuICB9LFxuICBlc2J1aWxkOiB7XG4gICAgbG9nT3ZlcnJpZGU6IHsgJ3RoaXMtaXMtdW5kZWZpbmVkLWluLWVzbSc6ICdzaWxlbnQnIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa2EsU0FBUyxvQkFBb0I7QUFDL2IsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFDaEIsT0FBTywyQkFBMkI7QUFKbEMsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQVcsU0FBUztBQUFBLElBQ2pDO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFHYixVQUFVLENBQUMsU0FBUyxhQUFhLG1CQUFtQixvQkFBb0IsUUFBUTtBQUFBLE1BQ2hGLFFBQVE7QUFBQSxRQUdOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxVQUNiLG1CQUFtQjtBQUFBLFVBQ25CLG9CQUFvQjtBQUFBLFVBQ3BCLFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixzQkFBc0I7QUFBQSxJQUN0QixJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxJQUNwQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sb0JBQW9CO0FBQUEsSUFDcEIsdUJBQXVCO0FBQUEsRUFDekI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLGFBQWEsRUFBRSw0QkFBNEIsU0FBUztBQUFBLEVBQ3REO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
