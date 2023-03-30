import React, { ReactNode } from 'react';

import type { Props } from '@theme/Footer/Layout';

import styles from './styles.module.css';

interface ExtendededProps extends Props {
  iconLinks: ReactNode;
}

/*
 * A slight variation of the Footer layout having
 * logo and copyright info at the left
 */
export default function FooterLayout({
  links,
  iconLinks,
  logo,
  copyright,
}: ExtendededProps): JSX.Element {
  return (
    <footer className="footer">
      <div className={`container container-fluid ${styles.container}`}>
        {(logo || copyright) && (
          <div>
            {logo && (
              <div className={`margin-bottom--sm ${styles.logo}`}>{logo}</div>
            )}
            <small>{copyright}</small>
          </div>
        )}
        {links}
        {iconLinks}
      </div>
    </footer>
  );
}
