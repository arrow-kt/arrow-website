import React from 'react';

import Link from '@docusaurus/Link';

// import iconArrowRight from '@site/static/img/icon-arrow-right.png';

import styles from './simple-card.module.css';

export interface SimpleCardProps {
  title: string;
  icon: string;
  link: string;
  body: string;
}

export function SimpleCard({ title, icon, link, body }: SimpleCardProps) {
  const linkUrl = link;

  return (
    <div className={`card ${styles.card}`}>
      <Link href={linkUrl} className="link--dark">
        <div className={`card__header ${styles.cardHeader}`}>
          <img
            className={styles.icon}
            src={`img/${icon}`}
            alt={`${title} category`}
            title={`${title} category`}
          />
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className="card__body">
          <p className={styles.body}>{body}</p>
        </div>
      </Link>
    </div>
  );
}
