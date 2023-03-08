import React from 'react';

import styles from './hero.module.css';

export interface SectionHeroProps {
  title: string;
  body: string;
}

export function SectionHero({
  title,
  body,
  className: classNameProp,
}): JSX.Element {
  return (
    <div className={`hero ${styles.hero} ${classNameProp}`}>
      <div className={`container ${styles.container}`}>
        <h1 className="hero__title">{title}</h1>
        <p>{body}</p>
      </div>
    </div>
  );
}
