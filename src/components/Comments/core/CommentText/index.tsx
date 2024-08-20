import React, { useEffect, useRef, useState } from 'react';
import emoji from 'react-easy-emoji';
import classNames from 'classnames';

import { stripEmojis } from '../../../../utils/regularExpressions';
import styles from './styles.module.scss';
import { IUser } from '../../../../models/IUser';

type CommentTextType = {
  text: string;
  className?: string;
  refUser?: IUser;
};

const CommentText: React.FC<CommentTextType> = ({ text, refUser, className }) => {
  const [isFullText, setIsFullText] = useState(false);
  const [height, setHeight] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const onlyEmojis = stripEmojis(text).length === 0;

  const onClickSeeeMore = () => {
    setIsFullText(!isFullText);
  };

  useEffect(() => {
    const h = textRef.current?.offsetHeight;
    if (h) setHeight(h);
  }, []);

  return (
    <>
      <p
        className={classNames(
          styles.text,
          isFullText && styles.fullText,
          onlyEmojis && styles.bigText,
          className
        )}
      >
        {refUser && (
          <span className={styles.text__userRef}>
            {refUser?.id && `@${refUser.first_name} ${refUser.last_name}`}
          </span>
        )}
        <span ref={textRef}>{emoji(text)}</span>
      </p>

      {height > 80 && (
        <>
          {!isFullText && <p className={styles.text__dots}>...</p>}
          <button onClick={onClickSeeeMore} className={styles.text__button}>
            {isFullText ? 'Show less' : 'Show more'}
          </button>
        </>
      )}
    </>
  );
};

export default CommentText;
