import React from 'react';

import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './icon-decoration.module.css';

export const IconDecoration = ({ children, icon }): JSX.Element => (
  <>
    <img
      className={styles.icon}
      src={useBaseUrl(`/img/${icon}`)}
      alt={'Icon'}
      title={'Icon'}
    />
    {children}
  </>
);
