import React, { memo } from 'react';


import { useThemeConfig, FooterLinkItem } from '@docusaurus/theme-common';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import FooterCopyright from '@theme/Footer/Copyright';

import FooterLayout from '@site/src/theme/Footer/Layout';
import IconLinks from '@site/src/theme/Footer/Links/IconLinks';

// The name of the links section that will be used differently
const externalLinksTitle = 'Links';

function Footer(): React.JSX.Element | null {
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
    </>
  );
}

export default memo(Footer);
