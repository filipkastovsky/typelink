import type { AstroIntegration } from 'astro';

const DEFAULT_GLOB = '**/*.astro';
const DIR = '.typelink';
const MODULE_NAME = 'typelink:routes';

type Options = {
  glob: string;
  cwd: string;
  path: string;
  enabled: boolean;
  watch: boolean;
};

const defaultOptions: Options = {
  glob: DEFAULT_GLOB,
  cwd: process.cwd() + '/',
  path: 'src/pages/',
  enabled: true,
  watch: true,
};

export const astro = async (options: Partial<Options> = {}): Promise<AstroIntegration> => {
  const mergedOptions = { ...defaultOptions, ...options };

  if (!mergedOptions.enabled) return { name: 'TypeLink', hooks: {} };

  const builder = await import('@typelink/builder');

  const printer = builder.createPrinter();
  const sourceFile = builder.createSourceFile('');
  const initialRoutes = await builder.collectFSRoutes(mergedOptions.glob, `${mergedOptions.cwd}${mergedOptions.path}`);

  const routes = new Set(initialRoutes);

  const buffered = builder.buffering(builder.printTypeNode('Routes', printer, MODULE_NAME, DIR, sourceFile, routes));

  buffered.batch(initialRoutes.map((route) => [route, 'ADD']));

  return {
    name: 'TypeLink',
    hooks: mergedOptions.watch
      ? {
          'astro:server:setup': ({ server }) => {
            server.watcher.on('add', (path) => {
              const relative = builder.toRelative(path, `${mergedOptions.cwd}${mergedOptions.path}`);
              if (!builder.isMatch(relative, mergedOptions.glob)) return;
              buffered(builder.toLink(relative), 'ADD');
            });

            server.watcher.on('unlink', (path) => {
              const relative = builder.toRelative(path, `${mergedOptions.cwd}${mergedOptions.path}`);
              if (!builder.isMatch(relative, `${mergedOptions.path}/${mergedOptions.glob}`)) return;
              buffered(builder.toLink(relative), 'REMOVE');
            });
          },
        }
      : {},
  };
};
