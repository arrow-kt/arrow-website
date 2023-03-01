import React from 'react';

import styles from './hero.module.css';

export function Hero(): JSX.Element {
  return (
    <div className={`hero ${styles.hero}`}>
      <div className={`container ${styles.container}`}>
        <h1 className="hero__title">
          Λrrow is a library for Typed <u>Functional Programming</u> in Kotlin
        </h1>
        <div className={styles.heroCta}>
          <button className="button button--primary button--lg">
            What is Λrrow
          </button>
          <button className="button button--primary button--lg">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
