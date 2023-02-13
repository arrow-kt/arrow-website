import React from 'react';

import styles from './Placeholder.module.css';


export function Placeholder({title}: {title: string}): JSX.Element {
  return <div className={styles.title}>{title}</div>;
}
