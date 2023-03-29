import React, { ReactNode } from 'react';

import Link from '@docusaurus/Link';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { useBlogPost } from '@docusaurus/theme-common/internal';

import styles from './styles.module.css';

interface BlogPostFrontMatterExpanded extends BlogPostFrontMatter {
  link: string;
}

interface BlogPostItemHeaderImageBaseProps {
  title: string;
  image: string;
}

function LinkWrapper({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): JSX.Element {
  return <Link href={href}>{children}</Link>;
}

const BlogPostItemHeaderImageBase = ({
  title,
  image,
}: BlogPostItemHeaderImageBaseProps): JSX.Element => (
  <div className={`${styles.imageContainer} margin-bottom--lg`}>
    <img
      className={styles.image}
      alt={`${title}`}
      title={`${title}`}
      src={image}
    />
  </div>
);

/*
 * An additional component to show the image of a post
 */
export default function BlogPostItemHeaderImage(): JSX.Element | null {
  const { metadata, frontMatter, assets } = useBlogPost();
  const { title } = metadata;
  const { withBaseUrl } = useBaseUrlUtils();
  const image = assets.image ?? frontMatter.image;
  const { link } = frontMatter as BlogPostFrontMatterExpanded;

  if (!image) {
    return null;
  }

  return link ? (
    <LinkWrapper href={link}>
      <BlogPostItemHeaderImageBase image={withBaseUrl(image)} title={title} />
    </LinkWrapper>
  ) : (
    <BlogPostItemHeaderImageBase image={withBaseUrl(image)} title={title} />
  );
}
