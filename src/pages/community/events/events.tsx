import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import { Hero } from '@site/src/components/Hero';
import {
  ImageCardLandscape,
  ImageCardProps,
} from '@site/src/components/ImageCard';
import { Banner } from '@site/src/components/Banner';

import data from './events.yml';
import styles from './events.module.css';

export default function Events(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Events" description={siteConfig.tagline}>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        ctaList={data.hero.ctaList}
        className={styles.verticalRhythm}
      />
      <main>
        <section
          className={`container ${styles.projectsContainer} ${styles.verticalRhythm}`}>
          {data.events.map((training: ImageCardProps) => (
            <ImageCardLandscape key={training.title} {...training} />
          ))}
        </section>
        <section>
          <Banner title={data.banner.title} ctaList={data.banner.ctaList} />
        </section>
      </main>
    </Layout>
  );
}
