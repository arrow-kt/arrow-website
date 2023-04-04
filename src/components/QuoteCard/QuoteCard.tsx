import React from 'react';

import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './quote-card.module.css';

export interface QuoteCardProps {
  name?: string;
  position?: string;
  image?: string;
  body?: string;
}

export function QuoteCard({ name, position, image, body }: QuoteCardProps) {
  return (
    <div className={`card ${styles.quoteCard}`}>
      <div className="card__body">
        <p>{body}</p>
      </div>
      <div className={`card__footer avatar`}>
        {image && (
          <div className="avatar__photo-wrapper">
            <img
              className="avatar__photo"
              src={useBaseUrl(`/img/${image}`)}
              alt={name}
              title={name}
            />
          </div>
        )}
        <div className="avatar__intro">
          <div className="avatar__name">{name}</div>
          <small className="avatar__subtitle">{position}</small>
        </div>
      </div>
    </div>
  );
}
