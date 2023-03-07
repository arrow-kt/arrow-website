import React from 'react';

import Link from '@docusaurus/Link';

import styles from './hero.module.css';

export function Hero({ className: classNameProp }): JSX.Element {
  return (
    <div className={`hero ${styles.hero} ${classNameProp}`}>
      <div className={`container ${styles.container}`}>
        <h1 className="hero__title">
          Λrrow is a library for Typed <u>Functional Programming</u> in Kotlin
        </h1>
        <div className={styles.heroCta}>
          <Link
            href={'learn/overview'}
            className="button button--primary button--lg">
            What is Λrrow
          </Link>
          <Link
            href={'learn/quickstart'}
            className="button button--primary button--lg">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
