import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type { Props } from '@theme/BlogListPage';

import { Hero } from '@site/src/components/Hero';
import { ImageCard, ImageCardProps } from '@site/src/components/ImageCard';

import data from './blog-list-page.yml';
import styles from './blog-list-page.module.css';

const formatSubtitle = (name: string | undefined, date: string): string =>
  name
    ? `${name}, ${new Date(date).toDateString()}`
    : `${new Date(date).toDateString()}`;

function BlogListPageMetadata(props: Props): React.JSX.Element {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): React.JSX.Element {
  const { metadata, items } = props;

  const posts = items.map((item) => ({
    title: item.content.metadata.title,
    subtitle: formatSubtitle(
      item.content.metadata.authors[0]?.name,
      item.content.metadata.date,
    ),
    image: item.content.frontMatter.image,
    body: item.content.metadata.description,
    href: item.content.metadata.permalink,
  }));

  return (
    <Layout>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        ctaList={data.hero.ctaList}
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
          <BlogListPaginator metadata={metadata} />
        </section>
      </main>
    </Layout>
  );
}

export default function BlogListPage(props: Props): React.JSX.Element {
  return (
    <HtmlClassNameProvider
      className={`${ThemeClassNames.wrapper.blogPages} ${ThemeClassNames.page.blogListPage}`}>
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
