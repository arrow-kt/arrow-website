import React from 'react';

import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Tag from '@theme/Tag';
import type { Props } from '@theme/TagsListInline';

import styles from './styles.module.css';

/*
 * An additional component to show the tags isolated
 */
export function TagsListInline({ tags }: Props): React.JSX.Element {
  return (
    <ul className={`padding--none`}>
      {tags.map(({ label, permalink: tagPermalink }) => (
        <li key={tagPermalink} className={styles.tag}>
          <Tag label={label} permalink={tagPermalink} description={label} />
        </li>
      ))}
    </ul>
  );
}

export default function BlogPostItemHeaderTags(): React.JSX.Element | null {
  const { metadata } = useBlogPost();
  const { tags } = metadata;

  const tagsExists = tags.length > 0;

  if (!tagsExists) {
    return null;
  }

  return <TagsListInline tags={tags} />;
}
