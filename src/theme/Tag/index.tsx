import React from 'react';

import Link from '@docusaurus/Link';
import type { Props } from '@theme/Tag';

import styles from './styles.module.css';

export default function Tag({ permalink, label, count }: Props): JSX.Element {
  return (
    <Link
      href={permalink}
      className={`${styles.tag} ${
        count ? styles.tagWithCount : styles.tagRegular
      }`}>
      {label}
      {count && <span>{count}</span>}
    </Link>
  );
}
