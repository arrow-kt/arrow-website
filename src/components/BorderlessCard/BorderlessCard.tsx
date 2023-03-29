import React from 'react';

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { LinkCardProps } from '@site/src/components/LinkCard/index';

import styles from './borderless-card.module.css';

export type BorderlessCardProps = PartiallyOptional<LinkCardProps, 'href'>;

export function BorderlessCard({
  title,
  icon,
  href,
  body,
}: BorderlessCardProps) {
  const infoMode = !href;
  const iconSize = infoMode ? '64px' : '32px';

  return (
    <div
      className={`card ${styles.borderlessCard} ${
        infoMode && styles.infoMode
      }`}>
      <div className={`card__header ${styles.cardHeader}`}>
        <img
          className={styles.icon}
          src={useBaseUrl(`/img/${icon}`)}
          alt={`${title} category`}
          title={`${title} category`}
          height={iconSize}
          width={iconSize}
        />
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={`card__body ${styles.cardBody}`}>
        <p>{body}</p>
      </div>
      {!infoMode && (
        <div className={`card__footer ${styles.cardFooter}`}>
          <strong>
            <Link href={href} className={styles.link}>
              Learn more
            </Link>
          </strong>
        </div>
      )}
    </div>
  );
}
