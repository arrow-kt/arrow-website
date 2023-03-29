import React from 'react';

import Link, { type Props as LinkProps } from '@docusaurus/Link';
import type { Props } from '@theme/BlogPostItem/Header/Author';

import styles from './styles.module.css';

function MaybeLink(props: LinkProps): JSX.Element {
  if (props.href) {
    return <Link {...props} />;
  }
  return <>{props.children}</>;
}

/*
 * A small variation of the BlogPostItemHeaderAuthor. This
 * is just setting the author image in a different position
 */
export default function BlogPostItemHeaderAuthor({
  author,
  className,
}: Props): JSX.Element {
  const { name, title, url, imageURL, email } = author;
  const link = url || (email && `mailto:${email}`) || undefined;
  return (
    <div className={`avatar ${styles.avatar} ${className}`}>
      {imageURL && (
        <MaybeLink
          href={link}
          className={`avatar__photo-link ${styles.imageContainer}`}>
          <img className="avatar__photo " src={imageURL} alt={name} />
        </MaybeLink>
      )}

      {name && (
        <div
          className="avatar__intro"
          itemProp="author"
          itemScope
          itemType="https://schema.org/Person">
          <div className="avatar__name">
            <MaybeLink href={link} itemProp="url">
              <span itemProp="name">{name}</span>
            </MaybeLink>
          </div>
          {title && (
            <small className="avatar__subtitle" itemProp="description">
              {title}
            </small>
          )}
        </div>
      )}
    </div>
  );
}
