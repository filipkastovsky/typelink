import { Link as RouterLink } from 'react-router-dom';
import type { ComponentProps } from 'react';
import type { Href } from '#typelink';

type LinkProps = Omit<ComponentProps<typeof RouterLink>, 'to'> & {
  to: Href;
};

export const Link = RouterLink as React.ForwardRefExoticComponent<LinkProps>;
