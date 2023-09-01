import type { FSWatcher } from 'chokidar';
const DEFAULT_GLOB = '**/!(_)*.tsx';
const DIR = '.typelink';
const MODULE_NAME = '#typelink';
const INTERFACE_NAME = 'Routes';

export type Options = {
  /**
   * Glob pattern to match files against
   *
   * @default **\/!(_)*.tsx
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

  /**
   * A function that returns a chokidar FSWatcher instance. If possible, use an instance that already exists (eg. vite's watcher)
   *
   * @default a brand spanking new chokidar FSWatcher instance
   */
  getWatcher(): FSWatcher;
};

const defaultOptions: Options = {
  glob: DEFAULT_GLOB,
  cwd: process.cwd() + '/',
  path: 'src/pages/',
  enabled: process.env['NODE_ENV'] === 'development',
  watch: true,
  getWatcher() {
    return require('chokidar').watch(this.cwd + this.path);
  },
};

export const watcher = (options: Partial<Options> = {}) => {
  const mergedOptions = Object.assign(defaultOptions, options);

  if (!mergedOptions.enabled) return;

  const utils = require('@typelink/utils') as typeof import('@typelink/utils');

  const printer = utils.createPrinter();
  const sourceFile = utils.createSourceFile('');

  const routes = new Set<string>();
  const enqueue = utils.buffering(utils.printTypeNode(INTERFACE_NAME, printer, MODULE_NAME, DIR, sourceFile, routes));

  utils.collectFSRoutes(mergedOptions.glob, `${mergedOptions.cwd}${mergedOptions.path}`).then((initialRoutes) => {
    for (const route of initialRoutes) {
      enqueue(route, 'ADD');
    }
  });

  if (!mergedOptions.watch) return;

  const watcher = mergedOptions.getWatcher();

  watcher.on('add', (path: string) => {
    const relative = utils.toRelative(path, `${mergedOptions.cwd}${mergedOptions.path}`);
    // If the path could not be made relative, ignore it
    if (relative.startsWith('/')) return;
    if (!utils.matches(relative, mergedOptions.glob)) return;
    enqueue(utils.toLink(relative), 'ADD');
  });

  watcher.on('unlink', (path: string) => {
    const relative = utils.toRelative(path, `${mergedOptions.cwd}${mergedOptions.path}`);
    // If the path could not be made relative, ignore it
    if (relative.startsWith('/')) return;
    if (!utils.matches(relative, mergedOptions.glob)) return;
    enqueue(utils.toLink(relative), 'REMOVE');
  });
};
