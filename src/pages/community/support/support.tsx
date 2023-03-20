import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import { Hero } from '@site/src/components/Hero';
import {
  BorderlessCard,
  BorderlessCardProps,
} from '@site/src/components/BorderlessCard';
import { Banner } from '@site/src/components/Banner';

import data from './support.yml';
import styles from './support.module.css';

export default function Support(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Support" description={siteConfig.tagline}>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        ctaList={data.hero.ctaList}
        className={styles.verticalRhythm}
      />
      <main>
        <section className={`container text--center ${styles.textContainer}`}>
          <h1>Community support</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est
          </p>
        </section>
        <section
          className={`container ${styles.navigationContainer} ${styles.verticalRhythm}`}>
          {data.links.map((nav: BorderlessCardProps) => (
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
