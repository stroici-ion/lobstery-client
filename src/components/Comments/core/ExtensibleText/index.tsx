import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import emoji from 'react-easy-emoji';
import classNames from 'classnames';

import { stripEmojis } from '../../../../utils/regularExpressions';
import styles from './styles.module.scss';
import { IUser } from '../../../../redux/profile/types';
import getUserName from '../../../user/utils/getUserName';
import useWindowResize from '../../../../hooks/useWindowResize';

type CommentTextType = {
  text: string;
  className?: string;
  mentionedUser?: IUser;
  displayedRows?: number;
  maxDisplayedRows?: number;
  showAll?: () => void;
};

const ExtensibleText: React.FC<CommentTextType> = ({
  text,
  mentionedUser,
  className,
  displayedRows = 4,
  maxDisplayedRows = 10,
  showAll,
}) => {
  const [isExpaned, setIsExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const onlyEmojis = stripEmojis(text).length === 0;
  const onClickSeeMore = () => {
    if (textRef.current) {
      setIsExpanded(!isExpaned);
    }
  };

  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkTextOverflows = useCallback(() => {
    const element = textRef.current;
    if (element) {
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, []);

  useEffect(() => checkTextOverflows, [text, isExpaned, textRef.current]);
  useWindowResize(checkTextOverflows);

  return (
    <div>
      <p
        ref={textRef}
        className={classNames(styles.text, className, onlyEmojis && styles.onlyEmojis)}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: isExpaned ? maxDisplayedRows : displayedRows,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {mentionedUser?.id && <span className={styles.text__mentionedUser}>{getUserName(mentionedUser)} </span>}
        {emoji(text)}
      </p>

      <div className={styles.text__row}>
        {isOverflowing ? (
          <>
            <button className={styles.text__button} onClick={onClickSeeMore}>
              {isExpaned ? 'Hide' : 'See more'}
            </button>
            {isExpaned && (
              <button onClick={showAll} className={classNames(styles.text__button, styles.text__showAll)}>
                Show all
              </button>
            )}
          </>
        ) : (
          <>
            {isExpaned && (
              <button onClick={onClickSeeMore} className={styles.text__button}>
                Hide
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExtensibleText;
