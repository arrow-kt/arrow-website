import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import { Hero } from '@site/src/components/Hero';
import {
  ImageCardLandscape,
  ImageCardProps,
} from '@site/src/components/ImageCard';
import { QuoteCard, QuoteCardProps } from '@site/src/components/QuoteCard';
import {
  BorderlessCard,
  BorderlessCardProps,
} from '@site/src/components/BorderlessCard';
import { Banner } from '@site/src/components/Banner';

import data from './training.yml';
import styles from './training.module.css';

export default function Training(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Training" description={siteConfig.tagline}>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        ctaList={data.hero.ctaList}
        className={styles.verticalRhythm}
      />
      <main>
        <section
          className={`container text--center ${styles.textContainer} ${styles.verticalRhythm}`}>
          <h1>Learn with Arrow</h1>
          <p>
            Arrow is composed of different libraries that greatly improve your
            developer experience using Kotlin
          </p>
        </section>
        <section
          className={`container ${styles.navigationContainer} ${styles.verticalRhythm}`}>
          {data.info.map((info: BorderlessCardProps) => (
            <BorderlessCard key={info.title} {...info} />
          ))}
        </section>
        <section
          className={`container text--center ${styles.textContainer} ${styles.verticalRhythm}`}>
          <h1>Start learning now</h1>
          <p>
            Arrow is composed of different libraries that greatly improve your
            developer experience using Kotlin
          </p>
        </section>
        <section
          className={`container ${styles.projectsContainer} ${styles.verticalRhythm}`}>
          {data.trainings.map((training: ImageCardProps) => (
            <ImageCardLandscape key={training.title} {...training} />
          ))}
        </section>
        <section
          className={`container text--center ${styles.textContainer} ${styles.verticalRhythm}`}>
          <h1>About our courses</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est
          </p>
        </section>
        <section
          className={`${styles.quotesContainer} ${styles.verticalRhythm}`}>
          {data.quotes.map((quote: QuoteCardProps) => (
            <QuoteCard key={quote.name} {...quote} />
          ))}
        </section>
        <section
          className={`container ${styles.navigationContainer} ${styles.verticalRhythm}`}>
          {data.navs.map((nav: BorderlessCardProps) => (
            <BorderlessCard key={nav.title} {...nav} />
          ))}
        </section>
        <section>
          <Banner title={data.banner.title} ctaList={data.banner.ctaList} />
        </section>
      </main>
    </Layout>
  );
}
