import React, { ReactNode } from 'react';

import Link from '@docusaurus/Link';

import styles from './banner.module.css';

export interface BannerProps extends Partial<Styled> {
  title: string | ReactNode;
  ctaList?: Array<Cta>;
}

export function Banner({
  title,
  ctaList,
  className: classNameProp,
}: BannerProps): JSX.Element {
  return (
    <div className={`${styles.wrapperContainer} ${classNameProp}`}>
      <div className={`container ${styles.container}`}>
        <h1>{title}</h1>
        <div className={styles.ctaList}>
          {ctaList &&
            ctaList.map(({ title, href }) => (
              <Link key={title} href={href} className="button button--primary">
                {title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
