import React from 'react';

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './simple-card.module.css';

export interface SimpleCardProps {
  title: string;
  icon: string;
  link: string;
  body: string;
}

export interface BaseCard extends SimpleCardProps {
  showFooter: boolean;
}

export function BaseCard({
  title,
  icon,
  link,
  body,
  showFooter = true,
}: BaseCard) {
  return (
    <div className={`card ${styles.simpleCard}`}>
      <Link href={link}>
        <div className={`card__header ${styles.cardHeader}`}>
          <img
            className={styles.icon}
            src={useBaseUrl(`/img/${icon}`)}
            alt={`${title} category`}
            title={`${title} category`}
          />
          <h2>{title}</h2>
        </div>
        <div className="card__body">
          <p>{body}</p>
        </div>
        {showFooter && (
          <div className={`card__footer`}>
            <strong>
              <Link href={link} className={styles.link}>
                Learn more
              </Link>
            </strong>
          </div>
        )}
      </Link>
    </div>
  );
}

export const SimpleCard = (props: SimpleCardProps) => (
  <BaseCard showFooter={false} {...props} />
);

export const FooterCard = (props: SimpleCardProps) => (
  <BaseCard showFooter={true} {...props} />
);
