import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  vite: {
    resolve: {
      alias: {
        '@data': '/data',
        '@game': '/src/game',
      },
    },
    plugins: [
      {
        name: 'fix-react-dom-client',
        enforce: 'post',
        resolveId(source) {
          if (source === 'react-dom/client') {
            return '\0react-dom-client-wrapped';
          }
        },
        load(id) {
          if (id === '\0react-dom-client-wrapped') {
            return `
import __cjs from '/node_modules/react-dom/client.js';
const createRoot = __cjs.createRoot;
const hydrateRoot = __cjs.hydrateRoot;
const version = __cjs.version;
export { createRoot, hydrateRoot, version };
export default __cjs;
`;
          }
        },
      },
    ],
  },
});
