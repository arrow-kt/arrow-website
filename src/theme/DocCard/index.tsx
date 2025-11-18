import React from 'react';

import { useCurrentSidebarCategory } from '@docusaurus/theme-common';
import { useDocById } from '@docusaurus/plugin-content-docs/client';
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';

import { LinkCard, LinkCardProps } from '@site/src/components/LinkCard';

const defaultIcon = 'icon-tutorial.svg';

/**
 * useCustomCurrentSidebarCategory gets the category associated with the current location.
 * It should only be used on category index pages. We are just wrapping it here safely
 */
function useCurrentSidebarCategoryWrapper(): PropSidebarItemCategory {
  try {
    return useCurrentSidebarCategory();
  } catch {
    return undefined;
  }
}

export default function DocCard({
  item,
}: {
  item: PropSidebarItemCategory | PropSidebarItemLink;
}): React.JSX.Element {
  const sidebarCategoryIcon = useCurrentSidebarCategoryWrapper()?.customProps
    ?.icon as string;

  const title = item.label;
  const icon =
    (item.customProps?.icon as string) || sidebarCategoryIcon || defaultIcon;
  const href = item.href;
  const body =
    (item.customProps?.description as string) ??
    ((item.type === 'link' && useDocById(item.docId ?? undefined))
      .description as string) ??
    undefined;

  const props: LinkCardProps = { title, icon, href, body };

  return <LinkCard {...props} />;
}
