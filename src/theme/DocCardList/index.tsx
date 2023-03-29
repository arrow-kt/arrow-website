import React from 'react';

import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from '@docusaurus/theme-common';
import DocCard from '@theme/DocCard';
import type { Props } from '@theme/DocCardList';

import styles from './doc-card-list.module.css';

function DocCardListForCurrentSidebarCategory({ className }: Props) {
  const category = useCurrentSidebarCategory();
  return <DocCardList items={category.items} className={className} />;
}

export default function DocCardList(props: Props): JSX.Element {
  const { items, className } = props;
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }
  const filteredItems = filterDocCardListItems(items);
  return (
    <section className={`${styles.container} ${className}`}>
      {filteredItems.map((item, index) => (
        <article key={index}>
          <DocCard item={item} />
        </article>
      ))}
    </section>
  );
}
