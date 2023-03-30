import React from 'react';

import BrowserOnly from '@docusaurus/BrowserOnly';
import { FooterLinkItem } from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { StarsCount } from '@site/src/components/StarsCount';

import styles from './styles.module.css';

interface IconLinksProps {
  links: FooterLinkItem[];
}

export default function IconLinks({ links }: IconLinksProps): JSX.Element {
  return (
    <ul className={`clean-list ${styles.container}`}>
      {links.map(({ label, href, icon }: FooterLinkItem) => (
        <li key={href}>
          <Link href={href}>
            <img
              src={useBaseUrl(`${icon}`)}
              alt={`${label}`}
              title={`${label}`}
              height="24px"
              width="24px"
            />
          </Link>
        </li>
      ))}
      <div className={styles.starsContainer}>
        <BrowserOnly fallback={<div>Loading...</div>}>
          {() => <StarsCount />}
        </BrowserOnly>
      </div>
    </ul>
  );
}
