import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  return {
    base: '/goit-js-hw-12/',
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src',
    build: {
      outDir: '../docs',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
      },
    },
    plugins: [
      injectHTML(),
      FullReload(['./src/**/**.html']),
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});
