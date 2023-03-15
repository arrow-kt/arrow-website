import React from 'react';

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { SimpleCardProps } from '@site/src/components/SimpleCard';

import styles from './borderless-card.module.css';

export function BorderlessCard({ title, icon, link, body }: SimpleCardProps) {
  return (
    <div className={`card ${styles.borderlessCard}`}>
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
      <div className={`card__footer`}>
        <strong>
          <Link href={link} className={styles.link}>
            Learn more
          </Link>
        </strong>
      </div>
    </div>
  );
}
