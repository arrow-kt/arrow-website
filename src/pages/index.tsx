import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import { Hero } from '@site/src/components/Hero';
import { SimpleCard, SimpleCardProps } from '@site/src/components/SimpleCard';

import data from './index.yml';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout description={siteConfig.tagline}>
      <Hero />
      <main>
        <section className="container text--center">
          <h1>Start learning now</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est
          </p>
        </section>
        <section className={`container ${styles.cardContainer}`}>
          {data.cards.map((card: SimpleCardProps) => (
            <SimpleCard key={card.title} {...card} />
          ))}
        </section>
      </main>
    </Layout>
  );
}
