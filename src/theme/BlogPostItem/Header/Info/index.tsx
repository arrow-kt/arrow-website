import React from 'react';

import { translate } from '@docusaurus/Translate';
import { usePluralForm } from '@docusaurus/theme-common';
import { useBlogPost } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/BlogPostItem/Header/Info';

import styles from './styles.module.css';

interface BlogPostFrontMatterExpanded extends BlogPostFrontMatter {
  event: string;
}

// Very simple pluralization: probably good enough for now
function useReadingTimePlural() {
  const { selectMessage } = usePluralForm();
  return (readingTimeFloat: number) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: 'theme.blog.post.readingTime.plurals',
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One min read|{readingTime} min read',
        },
        { readingTime },
      ),
    );
  };
}

function ReadingTime({ readingTime }: { readingTime: number }) {
  const readingTimePlural = useReadingTimePlural();
  return <>{readingTimePlural(readingTime)}</>;
}

function Date({
  date,
  formattedDate,
}: {
  date: string;
  formattedDate: string;
}) {
  return (
    <time dateTime={date} itemProp="datePublished">
      {formattedDate}
    </time>
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
}: Props): JSX.Element {
  const { frontMatter, metadata } = useBlogPost();
  const { date, formattedDate, readingTime } = metadata;
  const { event } = frontMatter as BlogPostFrontMatterExpanded;

  return (
    <div className={`${styles.container} margin-vert--md ${className}`}>
      {event && (
        <>
          {event}
          <Spacer />
        </>
      )}
      <Date date={date} formattedDate={formattedDate} />
      {typeof readingTime !== 'undefined' && (
        <>
          <Spacer />
          <ReadingTime readingTime={readingTime} />
        </>
      )}
    </div>
  );
}
