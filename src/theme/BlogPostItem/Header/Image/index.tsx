import React, { ReactNode } from 'react';

import Link from '@docusaurus/Link';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import { BlogPostFrontMatter } from '@docusaurus/plugin-content-blog';

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
}): React.JSX.Element {
  return <Link href={href}>{children}</Link>;
}

const BlogPostItemHeaderImageBase = ({
  title,
  image,
}: BlogPostItemHeaderImageBaseProps): React.JSX.Element => (
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
export default function BlogPostItemHeaderImage(): React.JSX.Element | null {
  const { metadata, frontMatter, assets } = useBlogPost();
  const { title } = metadata;
  const { withBaseUrl } = useBaseUrlUtils();
  const image = assets.image ?? frontMatter.image;
  const { link } = frontMatter as BlogPostFrontMatterExpanded;

  if (!image || frontMatter.no_image_on_post) {
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
