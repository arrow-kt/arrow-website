import React from 'react';

import { useBlogPost } from '@docusaurus/theme-common/internal';
import EditThisPage from '@theme/EditThisPage';

/*
 * This is exactly the same BlogPostItemFooter, just
 * without the TagsListInline component being rendered.
 * Also, removing some unnecessary logic, like the
 * truncatedPost one, as it's not necessary in our website.
 */
export default function BlogPostItemFooter(): JSX.Element | null {
  const { metadata } = useBlogPost();
  const { editUrl } = metadata;

  const renderFooter = !!editUrl;

  if (!renderFooter) {
    return null;
  }

  return (
    <footer className={'row docusaurus-mt-lg'}>
      <div className="col margin-top--sm">
        <EditThisPage editUrl={editUrl} />
      </div>
    </footer>
  );
}
