import React from 'react';

import { useBlogPost } from '@docusaurus/theme-common/internal';
import Tag from '@theme/Tag';
import type { Props } from '@theme/TagsListInline';

import styles from './styles.module.css';

/*
 * An additional component to show the tags isolated
 */
export function TagsListInline({ tags }: Props): JSX.Element {
  return (
    <ul className={`padding--none`}>
      {tags.map(({ label, permalink: tagPermalink }) => (
        <li key={tagPermalink} className={styles.tag}>
          <Tag label={label} permalink={tagPermalink} />
        </li>
      ))}
    </ul>
  );
}

export default function BlogPostItemHeaderTags(): JSX.Element | null {
  const { metadata } = useBlogPost();
  const { tags } = metadata;

  const tagsExists = tags.length > 0;

  if (!tagsExists) {
    return null;
  }

  return <TagsListInline tags={tags} />;
}
