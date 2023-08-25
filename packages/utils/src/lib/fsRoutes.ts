import { glob } from 'fast-glob';
import { isMatch } from 'micromatch';

export const matches = (path: string, globExp: string) => {
  return isMatch(path, globExp);
};

export const toRelative = (path: string, cwd: string) => {
  return path.replace(/\\/g, '/').replace(cwd, '');
};

export const toLink = (path: string) => {
  const withLeadingSlash = path.startsWith('/') ? path : '/' + path;
  const omitLastExt = withLeadingSlash.replace(/\.[^/.]+$/, '');

  if (omitLastExt === '/index') {
    return '/';
  }

  if (omitLastExt.endsWith('/index')) {
    return omitLastExt.slice(0, -6);
  }

  return omitLastExt;
};

export const collectFSRoutes = async (globExp: string, cwd: string) => {
  const files = await glob(globExp, { cwd });
  return files.map((file) => toLink(toRelative(file, cwd)));
};
