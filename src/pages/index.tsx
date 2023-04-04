import React from 'react';
import parse from 'html-react-parser';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import { Hero } from '@site/src/components/Hero';
import { LinkCard, LinkCardProps } from '@site/src/components/LinkCard/index';
import { ImageCard, ImageCardProps } from '@site/src/components/ImageCard';
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
        ctaList={data.hero.ctaList}
        className={styles.verticalRhythm}
      />
      <main>
        <section
          className={`container text--center ${styles.textContainer} ${styles.verticalRhythm}`}>
          <h1>Start learning now</h1>
          <p>
            Λrrow is composed of different libraries that greatly improve your
            developer experience using Kotlin
          </p>
        </section>
        <section
          className={`container ${styles.featuresContainer} ${styles.verticalRhythm}`}>
          {data.features.map((feature: LinkCardProps) => (
            <LinkCard key={feature.title} {...feature} />
          ))}
        </section>
{/*         <section */}
{/*           className={`container text--center ${styles.textContainer} ${styles.verticalRhythm}`}> */}
{/*           <h1>What can Λrrow do</h1> */}
{/*           <p> */}
{/*             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu */}
{/*             turpis molestie, dictum est */}
{/*           </p> */}
{/*         </section> */}
{/*         <section */}
{/*           className={`container ${styles.projectsContainer} ${styles.verticalRhythm}`}> */}
{/*           {data.projects?.map((project: ImageCardProps) => ( */}
{/*             <ImageCard key={project.title} {...project} /> */}
{/*           ))} */}
{/*         </section> */}
        <section
          className={`container text--center ${styles.textContainer} ${styles.verticalRhythm}`}>
          <h1>What the community says</h1>
          <p>
            Read reviews about Arrow from the community and its practitioners
          </p>
        </section>
        <section
          className={`container ${styles.quotesContainer} ${styles.verticalRhythm}`}>
          {data.quotes?.map((quote: QuoteCardProps) => (
            <QuoteCard key={quote.name} {...quote} />
          ))}
        </section>
        <section
          className={`container ${styles.navigationContainer} ${styles.verticalRhythm}`}>
          {data.navs?.map((nav: LinkCardProps) => (
            <BorderlessCard key={nav.title} {...nav} />
          ))}
        </section>
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
