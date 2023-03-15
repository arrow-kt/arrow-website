import React from 'react';
import Admonition from '@theme-original/Admonition';

import type AdmonitionType from '@theme/Admonition';
import type { WrapperProps } from '@docusaurus/types';

import IconDanger from '@site/static/img/icon-alert-danger.svg';
import IconInfo from '@site/static/img/icon-alert-info.svg';
import IconSecondary from '@site/static/img/icon-alert-secondary.svg';
import IconSuccess from '@site/static/img/icon-alert-success.svg';
import IconWarning from '@site/static/img/icon-alert-warning.svg';

type Props = WrapperProps<typeof AdmonitionType>;

const iconsMapping = {
  note: <IconSecondary />,
  tip: <IconSuccess />,
  info: <IconInfo />,
  caution: <IconWarning />,
  danger: <IconDanger />,
};

export default function AdmonitionWrapper({
  type,
  ...props
}: Props): JSX.Element {
  return (
    <>
      <Admonition icon={iconsMapping[type]} {...{ type, ...props }} />
    </>
  );
}
