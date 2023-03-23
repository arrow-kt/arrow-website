import React from 'react';

import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors';
// Additional components imports, set here for convenience
import BlogPostItemHeaderTags from '@theme/BlogPostItem/Header/Tags';
import BlogPostItemHeaderImage from '@theme/BlogPostItem/Header/Image';

export default function BlogPostItemHeader(): JSX.Element {
  return (
    <header className="text--center margin-bottom--lg">
      <BlogPostItemHeaderTitle />
      <BlogPostItemHeaderAuthors />
      <BlogPostItemHeaderInfo />
      <BlogPostItemHeaderTags />
      <BlogPostItemHeaderImage />
    </header>
  );
}
