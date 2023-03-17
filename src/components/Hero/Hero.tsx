import React, { ReactNode } from 'react';

import Link from '@docusaurus/Link';

import styles from './hero.module.css';

export interface HeroProps extends Partial<Styled> {
  title: string | ReactNode;
  subtitle?: string;
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
        <div className={styles.ctaList}>
          {ctaList &&
            ctaList.map(({ title, href }) => (
              <Link
                key={title}
                href={href}
                className="button button--primary button--lg">
                {title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
