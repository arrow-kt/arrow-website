import React from 'react';

import { BlogPostFrontMatter } from '@docusaurus/plugin-content-blog';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Link from '@docusaurus/Link';

interface BlogPostFrontMatterExpanded extends BlogPostFrontMatter {
  link: string;
}

/*
 * An additional component to show the image of a post
 */
export default function BlogPostItemHeaderLink(): React.JSX.Element | null {
  const blogPostContextValue = useBlogPost();
  const { link } =
    blogPostContextValue.frontMatter as BlogPostFrontMatterExpanded;
  const { title } = blogPostContextValue.metadata;

  if (!link) {
    return null;
  }

  return (
    <div className="text--bold margin-bottom--md">
      <Link href={link} title={title}>
        {title}
      </Link>
    </div>
  );
}
