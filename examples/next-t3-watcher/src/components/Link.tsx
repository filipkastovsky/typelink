import NextLink from "next/link";
import type { ComponentProps } from "react";
import type { Href } from "#typelink";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: Href;
};

export const Link = NextLink as React.ForwardRefExoticComponent<LinkProps>;
