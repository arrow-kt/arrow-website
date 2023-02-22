import React from 'react';

import Layout from '@theme/Layout';

import styles from './Placeholder.module.css';

export function Placeholder({ title }: { title: string }): JSX.Element {
  return (
    <Layout title={title} description={title}>
      <div className={styles.title}>{title}</div>
    </Layout>
  );
}
