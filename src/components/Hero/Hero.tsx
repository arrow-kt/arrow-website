import React, { ReactNode } from 'react';

import Link from '@docusaurus/Link';

import styles from './hero.module.css';

export interface HeroProps extends Partial<Styled> {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  ctaList?: Array<Cta>;
}

export function Hero({
  title,
  subtitle,
  ctaList,
  className: classNameProp,
}: HeroProps): JSX.Element {
  return (
    <div className={`hero ${styles.hero} ${classNameProp}`}>
      <div className={`container ${styles.container}`}>
        <h1 className="hero__title">{title}</h1>
        {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
      </div>
    </div>
  );
}
