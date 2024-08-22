import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "PasswordStrengthAnalyzer",
      formats: ["es", "umd"],
      fileName: (format) => `password-strength-analyzer.${format}.js`,
    },
  },
});
