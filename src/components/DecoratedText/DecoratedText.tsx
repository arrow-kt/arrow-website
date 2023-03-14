import React from 'react';

import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './decorated-text.module.css';

export interface DecoratedTextProps {
  children: string;
  icon: string;
  title?: string;
}

export const DecoratedText = ({
  children,
  icon,
  title,
}: DecoratedTextProps): JSX.Element => {
  // const currentSidebarcategory = useCurrentSidebarCategory();

  // console.log('DecoratedText currentSidebarcategory', currentSidebarcategory);
  // console.log('DecoratedText title', title);
  // console.log('DecoratedText icon', icon);

  return (
    <>
      <img
        className={styles.icon}
        src={useBaseUrl(`/img/${icon}`)}
        alt={'Icon'}
        title={'Icon'}
      />
      {title ? title : children}
    </>
  );
};
