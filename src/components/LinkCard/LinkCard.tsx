import React, { ReactNode } from 'react';

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './link-card.module.css';

export interface BaseCardProps {
  title: string;
  icon: string;
  body: string;
}

export interface LinkCardProps extends BaseCardProps {
  href: string;
}

function LinkWrapper({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Link href={href} className={styles.linkCard}>
      {children}
    </Link>
  );
}

export function BaseCard({ title, icon, body }: BaseCardProps) {
  return (
    <div className={`card`}>
      <div className={`card__header ${styles.cardHeader}`}>
        <img
          className={styles.icon}
          src={useBaseUrl(`/img/${icon}`)}
          alt={`${title} category`}
          title={`${title} category`}
          width="48px"
          height="48px"
        />
        <h2 title={title} className={`text--truncate`}>
          {title}
        </h2>
      </div>
      <div className={`card__body ${styles.cardBody}`}>
        <p className={`${styles.paragraph}`}>{body}</p>
      </div>
    </div>
  );
}

export const LinkCard = (props: LinkCardProps) => (
  <LinkWrapper href={props.href}>
    <BaseCard {...props} />
  </LinkWrapper>
);
