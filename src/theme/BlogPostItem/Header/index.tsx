import React from 'react';

import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors';

// Additional components imports, set here for convenience
import BlogPostItemHeaderTags from '@site/src/theme/BlogPostItem/Header/Tags';
import BlogPostItemHeaderImage from '@site/src/theme/BlogPostItem/Header/Image';
import BlogPostItemHeaderLink from '@site/src/theme/BlogPostItem/Header/Link';

export default function BlogPostItemHeader(): JSX.Element {
  return (
    <header className="text--center margin-bottom--md">
      <BlogPostItemHeaderTitle />
      <BlogPostItemHeaderAuthors />
      <BlogPostItemHeaderInfo />
      <BlogPostItemHeaderTags />
      <BlogPostItemHeaderImage />
      <BlogPostItemHeaderLink />
    </header>
  );
}
