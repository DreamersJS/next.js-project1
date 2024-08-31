// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
import { defineConfig } from 'postcss-load-config';

const config = defineConfig({
  plugins: {
    tailwindcss: {},
  },
});

export default config;
