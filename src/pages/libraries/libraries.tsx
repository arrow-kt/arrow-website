import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
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
    <Layout title="More libraries" description={siteConfig.tagline}>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        ctaList={data.hero.ctaList}
        className={styles.verticalRhythm}
      />
      <main>
        <section
          className={`${styles.featuresContainer} ${styles.verticalRhythm}`}>
          {data.libraries.map((library: LinkCardProps) => (
            <LinkCard key={library.title} {...library} />
          ))}
        </section>
        <section
          className={`container text--center ${styles.textContainer} ${styles.verticalRhythm}`}>
          <h1>Even more libraries?</h1>
          <p>
            We'd love to
            <Link href="https://github.com/arrow-kt/arrow-website/issues">
              {' hear '}
            </Link>
            about other library which complements the Arrow libraries and should
            be featured here!
          </p>
        </section>
        {data.navs && (
          <section
            className={`container ${styles.navigationContainer} ${styles.verticalRhythm}`}>
            {data.navs.map((nav: BorderlessCardProps) => (
              <BorderlessCard key={nav.title} {...nav} />
            ))}
          </section>
        )}
      </main>
    </Layout>
  );
}
