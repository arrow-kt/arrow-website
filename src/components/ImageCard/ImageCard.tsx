import React from 'react';

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './image-card.module.css';

export interface ImageCardProps {
  title?: string;
  image?: string;
  body?: string;
  link?: string;
}

export function ImageCard({
  title = 'Case study',
  image = useBaseUrl('/img/sample-image.jpg'),
  body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie',
  link = 'about/use-cases',
}: ImageCardProps) {
  return (
    <div className={`card ${styles.card}`}>
      <div className="card__image text--center">
        <img
          className={styles.image}
          src={image}
          alt={`${title} category`}
          title={`${title} category`}
        />
      </div>
      <div className="card__body">
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{body}</p>
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
