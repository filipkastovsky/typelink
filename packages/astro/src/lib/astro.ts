import type { AstroIntegration } from 'astro';
import { type Options, watcher } from '@typelink/watcher';

const DEFAULT_GLOB = '**/*.astro';

const DEFAULT_OPTIONS: Partial<Options> = {
  glob: DEFAULT_GLOB,
};

export const astro = (options: Partial<Options> = {}): AstroIntegration => {
  return {
    name: 'TypeLink',
    hooks: {
      'astro:server:setup': ({ server }) => {
        watcher({
          ...DEFAULT_OPTIONS,
          getWatcher() {
            return server.watcher;
          },
          ...options,
        });
      },
    },
  };
};
