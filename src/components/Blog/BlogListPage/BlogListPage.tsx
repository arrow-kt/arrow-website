import React from 'react';

import Link from '@docusaurus/Link';
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
import { Banner } from '@site/src/components/Banner';

import data from './blog-list-page.yml';
import styles from './blog-list-page.module.css';

const formatSubtitle = (name: string | undefined, date: string): string =>
  name ? `${name}, ${date}` : `${date}`;

function BlogListPageMetadata(props: Props): JSX.Element {
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

function BlogListPageContent(props: Props): JSX.Element {
  const { metadata, items } = props;

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
        <section>
          <Banner title={data.banner.title} ctaList={data.banner.ctaList} />
        </section>
        <section
          className={`margin-top--md margin-bottom--md ${styles.linksContainer}`}>
          <Link href="/community/blog/archive">Archive</Link>
          <Link href="/community/blog/atom.xml">Atom feed</Link>
          <Link href="/community/blog/rss.xml">RSS feed</Link>
        </section>
      </main>
    </Layout>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={`${ThemeClassNames.wrapper.blogPages} ${ThemeClassNames.page.blogListPage}`}>
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
