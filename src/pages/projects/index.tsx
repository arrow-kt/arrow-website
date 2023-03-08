import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import { SectionHero } from '@site/src/components/SectionHero';
import { SimpleCard, SimpleCardProps } from '@site/src/components/SimpleCard';

import data from './projects.yml';
import styles from './../index.module.css';

export default function Projects(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout description={siteConfig.tagline}>
      <SectionHero
        title="Projects"
        body="Libraries that complement the Arrow ecosystem"
        className={styles.verticalRhythm}
      />
      <main>
        <section
          className={`container ${styles.featuresContainer} ${styles.verticalRhythm}`}>
          {data.features.map((feature: SimpleCardProps) => (
            <SimpleCard key={feature.title} {...feature} />
          ))}
        </section>
      </main>
    </Layout>
  );
}
