import React, { memo } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import EnhancedChat from 'enhancedocs-chat';

import { useThemeConfig, FooterLinkItem } from '@docusaurus/theme-common';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import FooterCopyright from '@theme/Footer/Copyright';

import FooterLayout from '@site/src/theme/Footer/Layout';
import IconLinks from '@site/src/theme/Footer/Links/IconLinks';

import 'enhancedocs-chat/dist/style.css';

// The name of the links section that will be used differently
const externalLinksTitle = 'Links';

function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig();
  if (!footer) {
    return null;
  }

  const { copyright, links, logo, style } = footer;

  /*
   * The following is a quick way to split the array in two based on a
   * condition, which in in our case is the title of the section. This is
   * using the comma operator to return the right hand side of the expression.
   * The left hand side is evaluated, but its return value is discarded.
   */
  const [iconLinks, textLinks] = (links as FooterLinkItem[]).reduce(
    (accumulator: FooterLinkItem[][], section: FooterLinkItem) => (
      accumulator[section.title === externalLinksTitle ? 0 : 1].push(section),
      accumulator
    ),
    [[], []],
  );

  const iconLinksItems = iconLinks[0].items as FooterLinkItem[];

  return (
    <>
      <FooterLayout
        style={style}
        links={
          textLinks && textLinks.length > 0 && <FooterLinks links={textLinks} />
        }
        iconLinks={
          iconLinksItems &&
          iconLinksItems.length > 0 && <IconLinks links={iconLinksItems} />
        }
        logo={logo && <FooterLogo logo={logo} />}
        copyright={copyright && <FooterCopyright copyright={copyright} />}
      />

      <EnhancedChat
        config={{
          projectId: '6442ad83351c12aba70adc49',
          accessToken: 'pk_6c67a49f78a72d32727881bc42733cbb9da115b85cc1b3d2',
        }}
        theme={{
          primaryColor: 'var(--ifm-color-primary)',
          botName: 'Arrow AI Assistant',
          logo: {
            src: '/img/arrow-brand-icon.svg',
            alt: 'Arrow logo',
          },
        }}
        size="small"
        shape="square"
        icon="chat"
      />
    </>
  );
}

export default memo(Footer);
