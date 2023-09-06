import { defineCollection, z, type CollectionEntry } from 'astro:content';
import type { FromUnion } from '@typelink/core';
import type { FSHref } from '#typelink';

const base = '/blog' satisfies FSHref;
declare module '#typelink' {
  export type Content = `${typeof base}/${CollectionEntry<'blog'>['slug']}`;
  interface Routes extends FromUnion<Content> {}
}

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
