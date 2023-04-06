import React from 'react';

import { useLocation } from '@docusaurus/router';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Translate, { translate } from '@docusaurus/Translate';
import { PageMetadata } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const oldSiteHost = 'old.arrow-kt.io';

export default function NotFound(): JSX.Element {
  const location = useLocation();

  return (
    <>
      <PageMetadata
        title={translate({
          id: 'theme.NotFound.title',
          message: 'Page Not Found',
        })}
      />
      <Layout>
        <main className="container margin-vert--xl">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <h1 className="hero__title">
                <Translate
                  id="theme.NotFound.title"
                  description="The title of the 404 page">
                  Page Not Found
                </Translate>
              </h1>
              <p>
                <Translate
                  id="theme.NotFound.p1"
                  description="The first paragraph of the 404 page">
                  We could not find what you were looking for.
                </Translate>
              </p>
              <BrowserOnly>
                {() => (
                  <p>
                    You can try the previous Arrow site in
                    <Link
                      href={`https://${oldSiteHost}${location.pathname}`}>{` ${oldSiteHost}${location.pathname}`}</Link>
                  </p>
                )}
              </BrowserOnly>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
