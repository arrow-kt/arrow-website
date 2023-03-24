import React from 'react';

import Layout from '@theme/Layout';
import type { Props } from '@theme/BlogLayout';

import styles from './blog-layout.module.css';

/*
 * Custom BlogLayout without Sidebar nor ToC.
 * Also including an additional container to have a
 * background similar as the rest of pages in the site
 */
export default function BlogLayout(props: Props): JSX.Element {
  const { children, ...layoutProps } = props;

  return (
    <Layout {...layoutProps}>
      <div className={styles.background}>
        <div className="container margin-vert--lg">
          <div className="row">
            <main
              className="col col--8 col--offset-2"
              itemScope
              itemType="http://schema.org/Blog">
              {children}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
