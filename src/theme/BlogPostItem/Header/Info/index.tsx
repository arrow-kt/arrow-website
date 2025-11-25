import React from 'react';
import { formatDistance } from 'date-fns';

import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import { BlogPostFrontMatter } from '@docusaurus/plugin-content-blog';
import type { Props } from '@theme/BlogPostItem/Header/Info';

import styles from './styles.module.css';

interface BlogPostFrontMatterExpanded extends BlogPostFrontMatter {
  event: string;
}

function DateInfo({ date }: { date: string }) {
  return (
    <>
      <time dateTime={date} itemProp="datePublished">
        {formatDistance(new Date(date), new Date(), { addSuffix: true })}
      </time>
      <Spacer />
      <time dateTime={date} itemProp="datePublished">
        {new Date(date).toDateString()}
      </time>
    </>
  );
}

function Spacer() {
  return <>{' · '}</>;
}

/*
 * A small variation of the BlogPostItemHeaderInfo. It's done
 * to include the event info, if available, in this component.
 */
export default function BlogPostItemHeaderInfo({
  className,
}: Props): React.JSX.Element {
  const { frontMatter, metadata } = useBlogPost();
  const { date } = metadata;
  const { event } = frontMatter as BlogPostFrontMatterExpanded;

  return (
    <div className={`${styles.container} margin-vert--md ${className}`}>
      {event && (
        <>
          {event}
          <Spacer />
        </>
      )}
      <DateInfo date={date} />
    </div>
  );
}
