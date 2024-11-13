import React from 'react';
import parse from 'html-react-parser';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import { Hero } from '@site/src/components/Hero';
import { LinkCard, LinkCardProps } from '@site/src/components/LinkCard/index';
import { QuoteCard, QuoteCardProps } from '@site/src/components/QuoteCard';
import { BorderlessCard } from '@site/src/components/BorderlessCard';

import data from './index.yml';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout description={siteConfig.tagline}>
      <Hero
        title={parse(data.hero.title)}
        subtitle={parse(data.hero.subtitle)}
        ctaList={data.hero.ctaList}
      />
      <main>
        <section
          className={`${styles.featuresContainer} ${styles.verticalRhythm}`}>
          {data.features.map((feature: LinkCardProps) => (
            <LinkCard key={feature.title} {...feature} />
          ))}
        </section>
        <section
          className={`container text--center margin-bottom--lg ${styles.textContainer}`}>
          <h1>What the community says</h1>
        </section>
        <section
          className={`${styles.quotesContainer} ${styles.verticalRhythm}`}>
          {data.quotes?.map((quote: QuoteCardProps) => (
            <QuoteCard key={quote.name} {...quote} />
          ))}
        </section>
        {data.navs && (
          <section
            className={`container ${styles.navigationContainer} ${styles.verticalRhythm}`}>
            {data.navs.map((nav: LinkCardProps) => (
              <BorderlessCard key={nav.title} {...nav} />
            ))}
          </section>
        )}
        <section className={`${styles.usageWrapperContainer}`}>
          <div className={`container ${styles.usageContainer}`}>
            {data.companies?.map((company: { name: string; logo: string }) => (
              <img
                key={company.name}
                src={useBaseUrl(`/img/${company.logo}`)}
                alt={company.name}
                title={company.name}
              />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
