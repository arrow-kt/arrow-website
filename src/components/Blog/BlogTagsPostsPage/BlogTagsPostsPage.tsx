import React from 'react';

import { translate } from '@docusaurus/Translate';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  usePluralForm,
} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type { Props } from '@theme/BlogTagsPostsPage';

import { Hero } from '@site/src/components/Hero';
import { ImageCard, ImageCardProps } from '@site/src/components/ImageCard';

import styles from './blog-tags-posts-page.module.css';

const formatSubtitle = (name: string | undefined, date: string): string =>
  name ? `${name}, ${date}` : `${date}`;

// Very simple pluralization: probably good enough for now
function useBlogPostsPlural() {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          id: 'theme.blog.post.plurals',
          description:
            'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One post|{count} posts',
        },
        { count },
      ),
    );
}

function useBlogTagsPostsPageTitle(tag: Props['tag']): string {
  const blogPostsPlural = useBlogPostsPlural();
  return translate(
    {
      id: 'theme.blog.tagTitle',
      description: 'The title of the page for a blog tag',
      message: '{nPosts} tagged with “{tagName}”',
    },
    { nPosts: blogPostsPlural(tag.count), tagName: tag.label },
  );
}

function BlogTagsPostsPageMetadata({ tag }: Props): JSX.Element {
  const title = useBlogTagsPostsPageTitle(tag);
  return (
    <>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_tags_posts" />
    </>
  );
}

function BlogTagsPostsPageContent(props: Props): JSX.Element {
  const { tag, listMetadata, items } = props;

  const title = useBlogTagsPostsPageTitle(tag);
  const cta = {
    title: 'View All Tags',
    href: tag.allTagsPath,
  };

  const posts = items.map((item) => ({
    title: item.content.metadata.title,
    subtitle: formatSubtitle(
      item.content.metadata.authors[0]?.name,
      item.content.metadata.formattedDate,
    ),
    image: item.content.frontMatter.image,
    body: item.content.metadata.description,
    href: item.content.metadata.permalink,
  }));

  return (
    <Layout>
      <Hero
        title={tag.label}
        subtitle={title}
        ctaList={[cta]}
        className={styles.verticalRhythm}
      />
      <main>
        <section
          className={`container ${styles.projectsContainer} ${styles.verticalRhythm}`}>
          {posts.map((post: ImageCardProps) => (
            <ImageCard key={post.title} {...post} />
          ))}
        </section>
        <section className={`container ${styles.verticalRhythm}`}>
          <BlogListPaginator metadata={listMetadata} />
        </section>
      </main>
    </Layout>
  );
}

export default function BlogTagsPostsPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={`${ThemeClassNames.wrapper.blogPages} ${ThemeClassNames.page.blogTagPostListPage}`}>
      <BlogTagsPostsPageMetadata {...props} />
      <BlogTagsPostsPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
