import React from 'react';

import styles from './quote-card.module.css';

export interface QuoteCardProps {
  name?: string;
  position?: string;
  image?: string;
  body?: string;
}

export function QuoteCard({
  name = 'Francisco Díaz',
  position = 'Principal at Xebia Functional',
  body,
}: QuoteCardProps) {
  return (
    <div className={`card ${styles.quoteCard}`}>
      <div className="card__body">
        <p>{body}</p>
      </div>
      <div className={`card__footer avatar`}>
        <div className="avatar__intro">
          <div className="avatar__name">{name}</div>
          <small className="avatar__subtitle">{position}</small>
        </div>
      </div>
    </div>
  );
}
