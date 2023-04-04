import React from 'react';

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './image-card.module.css';

export interface ImageCardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  body?: string;
  href?: string;
}

export interface ImageCardOptionsProps extends ImageCardProps {
  landscapeMode: boolean;
}

export function ImageCardBase({
  title = 'Case study',
  subtitle,
  image = useBaseUrl('/img/sample-image.jpg'),
  body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie',
  href,
  landscapeMode = false,
}: ImageCardOptionsProps) {
  return (
    <div
      className={`card ${styles.card} ${
        landscapeMode && styles.landscapeMode
      }`}>
      <div className={`card__image ${styles.imageContainer}`}>
        <img
          className={styles.image}
          src={image}
          alt={`${title}`}
          title={`${title}`}
        />
      </div>
      <div className={`card__body ${styles.body}`}>
        <h3 className={styles.title}>{title}</h3>
        <h5 className={styles.subtitle}>{subtitle}</h5>
        <p className={styles.text}>{body}</p>
        <strong className={styles.linkContainer}>
          <Link href={href} className={styles.link}>
            Learn more
          </Link>
        </strong>
      </div>
    </div>
  );
}

export const ImageCardLandscape = (props: ImageCardProps) => (
  <ImageCardBase landscapeMode {...props} />
);

export const ImageCard = (props: ImageCardProps) => (
  <ImageCardBase landscapeMode={false} {...props} />
);
