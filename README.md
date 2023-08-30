# Typelink

Typesafe autocomplete for all your paths!

![Autocomplete](./media/autocomplete.png)

✅ Never worry about **typos** in your paths again

✅ Do not waste time **looking** for the right path in your documentation

✅ No need to **maintain** a list of all **your routes**

✅ **Seamless** integration, **incremental** adoption

✅ **ZERO bundle size** option

> WARNING: It is **very early** in the project, and the API is **not stable** yet. Use at your own risk!

## Quick Start

### Astro

#### Install the core package and the Astro adapter

```sh
# pnpm
pnpm add @typelink/core
pnpm add -D @typelink/adapter-astro

# yarn
yarn add @typelink/core
yarn add -D @typelink/adapter-astro

# npm
npm install @typelink/core
npm install -D @typelink/adapter-astro
```

#### Add the adapter to your Astro config

```js
// astro.config.mjs

import t from '@typelink/adapter-astro';

export default defineConfig({
  //   ...
  integrations: [other(), integrations(), /* + */ t.astro()],
  //   ...
});
```

#### Add the type reference to your `env.d.ts` file

```ts
// env.d.ts

/// <reference types="../.typelink/routes.d.ts" />
```

Now, a package `typelink:routes` should be available in your project. This package exposes a type `Routes` that contains all the routes defined in your project.

#### (**Recommended**) Create your own `<Link>` using the new definitions

```astro
// components/Link.astro

---
import type { Routes } from "typelink:routes";

type Props = Omit<astroHTML.JSX.AnchorHTMLAttributes, "href"> & {
  href: Routes;
};
const props = Astro.props;
---

<a {...props}>
  <slot />
</a>
```

### Standalone (FS routes)

#### Install the core package and the watcher

```sh
# pnpm
pnpm add @typelink/core
pnpm add -D @typelink/watcher

# yarn
yarn add @typelink/core
yarn add -D @typelink/watcher

# npm
npm install @typelink/core
npm install -D @typelink/watcher
```

#### Run the watcher, ideally in a config file if possible

```js
//  config.js

import t from '@typelink/watcher';

t.watcher({
  // Add a glob to match which files should be considered routes
  glob: '**/!(_)*.tsx', // ex. All .tsx files that do not start with an underscore

  // Add a path to the folder where your pages are located
  path: 'src/pages/', // Don't forget the trailing slash!
});
```

#### Include `typelink` in your `tsconfig.json`

```json
{
  // ...
  "include": ["other", "stuff", /* + */ ".typelink/*.ts"]
  // ...
}
```

#### (**Recommended**) Create your own `<Link>` using the new definitions using your framework of choice

Next.js example:

```tsx
// components/Link.tsx

import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import type { Routes } from 'typelink:routes';

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: Routes;
};

export const Link = NextLink as React.ForwardRefExoticComponent<LinkProps>;
```

## Features

### Automatic routes discovery (fs routes)

TODO:

### Dynamic route param typesafety

TODO:

## Upcoming features

- 🚧 typesafe **query params**
- 🚧 Automatic routes discovery (non-fs routes)
- 🚧 Manual route declaration, extending existing types
- 🚧 Tighter framework integration (include components, router methods etc.)

## Limitations

TODO:

## Contributing

TODO:
