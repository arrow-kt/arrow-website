import React from 'react';

import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { useBlogPost } from '@docusaurus/theme-common/internal';

import styles from './styles.module.css';

/*
 * An additional component to show the image of a post
 */
export default function BlogPostItemHeaderImage(): JSX.Element | null {
  const { metadata, frontMatter, assets } = useBlogPost();
  const { title } = metadata;
  const { withBaseUrl } = useBaseUrlUtils();
  const image = assets.image ?? frontMatter.image;

  if (!image) {
    return null;
  }

  return (
    <div className={styles.imageContainer}>
      <img
        className={styles.image}
        alt={`${title}`}
        title={`${title}`}
        src={withBaseUrl(image)}
      />
    </div>
  );
}
