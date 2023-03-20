import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import { Hero } from '@site/src/components/Hero';
import { LinkCard, LinkCardProps } from '@site/src/components/LinkCard';
import {
  BorderlessCard,
  BorderlessCardProps,
} from '@site/src/components/BorderlessCard';
import { Banner } from '@site/src/components/Banner';

import data from './libraries.yml';
import styles from './libraries.module.css';

export default function Libraries(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Libraries" description={siteConfig.tagline}>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        ctaList={data.hero.ctaList}
        className={styles.verticalRhythm}
      />
      <main>
        <section
          className={`container ${styles.featuresContainer} ${styles.verticalRhythm}`}>
          {data.libraries.map((library: LinkCardProps) => (
            <LinkCard key={library.title} {...library} />
          ))}
        </section>
        <section className={`container text--center ${styles.textContainer}`}>
          <h1>More libraries</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est
          </p>
        </section>
        <section
          className={`container ${styles.featuresContainer} ${styles.verticalRhythm}`}>
          {data.more_libraries.map((library: LinkCardProps) => (
            <LinkCard key={library.title} {...library} />
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
