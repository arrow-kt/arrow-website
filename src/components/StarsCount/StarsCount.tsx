import React from 'react';

import useIsBrowser from '@docusaurus/useIsBrowser';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

import { useGithubInfo } from '@site/src/utils/useGithubInfo';

import styles from './stars-count.module.css';

const githubLink = 'https://github.com/arrow-kt/arrow';
const icon = '/img/icon-social-github.svg';

export const StarsCount = () => {
  const isBrowser = useIsBrowser();
  const iconPath = useBaseUrl(`${icon}`);
  const { githubInfo } = useGithubInfo();

  if (!isBrowser) {
    return null;
  }

  const stars = githubInfo?.watchers as number;

  return (
    <>
      {stars && (
        <Link
          title="Star us in GitHub!"
          href={githubLink}
          className={`pills__item pills__item--active ${styles.link}`}>
          <img
            src={iconPath}
            className={styles.icon}
            alt="GitHub"
            height="24px"
            width="24px"
          />
          arrow • {stars.toLocaleString()} <span>⭐</span>
        </Link>
      )}
    </>
  );
};
