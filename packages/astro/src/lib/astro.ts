import type { AstroIntegration } from 'astro';

const DEFAULT_GLOB = '**/*.astro';
const DIR = '.typelink';
const MODULE_NAME = 'typelink:routes';

type Options = {
  /**
   * Glob pattern to match files against
   *
   * @default **\/*.astro
   */
  glob: string;
  /**
   * Working directory, **must end with a trailing slash**!
   *
   * @default process.cwd() + '/'
   */
  cwd: string;
  /**
   * Path to the pages directory, **must end with a trailing slash**!
   *
   * @default src/pages/
   */
  path: string;
  /**
   * Enable/disable the integration, disabling the integration will not require its dependencies to be installed
   *
   * @default process.env['NODE_ENV'] === 'development'
   */
  enabled: boolean;

  /**
   * Enable/disable watching for changes
   *
   * @default true
   */
  watch: boolean;
};

const defaultOptions: Options = {
  glob: DEFAULT_GLOB,
  cwd: process.cwd() + '/',
  path: 'src/pages/',
  enabled: process.env['NODE_ENV'] === 'development',
  watch: true,
};

export const astro = async (options: Partial<Options> = {}): Promise<AstroIntegration> => {
  const mergedOptions = { ...defaultOptions, ...options };

  if (!mergedOptions.enabled) return { name: 'TypeLink', hooks: {} };

  const utils = await import('@typelink/utils');
  const printer = utils.createPrinter();
  const sourceFile = utils.createSourceFile('');
  const initialRoutes = await utils.collectFSRoutes(mergedOptions.glob, `${mergedOptions.cwd}${mergedOptions.path}`);

  const routes = new Set(initialRoutes);

  const buffer = utils.buffering(utils.printTypeNode('Routes', printer, MODULE_NAME, DIR, sourceFile, routes));

  buffer.batch(initialRoutes.map((route) => [route, 'ADD']));

  return {
    name: 'TypeLink',
    hooks: mergedOptions.watch
      ? {
          'astro:server:setup': ({ server }) => {
            server.watcher.on('add', (path) => {
              const relative = utils.toRelative(path, `${mergedOptions.cwd}${mergedOptions.path}`);
              // If the path could not be made relative, ignore it
              if (relative.startsWith('/')) return;
              if (!utils.matches(relative, mergedOptions.glob)) return;
              buffer(utils.toLink(relative), 'ADD');
            });

            server.watcher.on('unlink', (path) => {
              const relative = utils.toRelative(path, `${mergedOptions.cwd}${mergedOptions.path}`);
              // If the path could not be made relative, ignore it
              if (relative.startsWith('/')) return;
              if (!utils.matches(relative, mergedOptions.glob)) return;
              buffer(utils.toLink(relative), 'REMOVE');
            });
          },
        }
      : {},
  };
};
