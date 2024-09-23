import React, { useEffect, useMemo, useRef, useState } from 'react';
import emoji from 'react-easy-emoji';
import classNames from 'classnames';

import { stripEmojis } from '../../../../utils/regularExpressions';
import styles from './styles.module.scss';
import { IUser } from '../../../../models/IUser';
import getUserName from '../../../user/utils/getUserName';

type CommentTextType = {
  text: string;
  className?: string;
  refUser?: IUser;
  displayedRows?: number;
  maxDisplayedRows?: number;
  showAll?: () => void;
};

const ExtensibleText: React.FC<CommentTextType> = ({
  text,
  refUser,
  className,
  displayedRows = 4,
  maxDisplayedRows = 10,
  showAll,
}) => {
  const [isExpaned, setIsExpanded] = useState(false);
  const [isSeeMoreVisible, setIsSeeMoreVisible] = useState(false);
  const [isOverHeight, setIsOverHeight] = useState(false);
  const [isOverMaxHeight, setIsOverMaxHeight] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const oneLineTextRef = useRef<HTMLDivElement>(null);

  const displayHeight = useRef(0);
  const maxDisplayHeight = useRef(0);

  const onlyEmojis = stripEmojis(text).length === 0;

  const onClickSeeMore = () => {
    if (textRef.current) {
      if (isExpaned) textRef.current.style.maxHeight = `${displayHeight.current}px`;
      else textRef.current.style.maxHeight = `${maxDisplayHeight.current}px`;
      setIsExpanded(!isExpaned);
    }
  };

  const calculateTextHeight = () => {
    if (textRef.current && oneLineTextRef.current) {
      const lineHeight = oneLineTextRef.current.offsetHeight;
      const rowHeight = textRef.current.offsetHeight;
      displayHeight.current = lineHeight * displayedRows;
      maxDisplayHeight.current = lineHeight * maxDisplayedRows;
      textRef.current.style.maxHeight = `${displayHeight.current}px`;

      if (displayHeight.current < rowHeight) {
        setIsSeeMoreVisible(true);
      }

      if (maxDisplayHeight.current < rowHeight) {
        setIsOverHeight(true);
      }
    }
  };

  useEffect(() => {
    calculateTextHeight();
  }, [textRef, oneLineTextRef]);

  return (
    <div>
      <p className={className} style={{ visibility: 'hidden', position: 'absolute' }} ref={oneLineTextRef}>
        1
      </p>
      <p
        className={classNames(
          styles.text,
          className,
          isSeeMoreVisible && (!isExpaned || isOverHeight) && styles.overHeight
        )}
        ref={textRef}
      >
        {refUser?.id && <span className={styles.text__userRef}>{getUserName(refUser)}</span>}
        {text}
      </p>
      {isSeeMoreVisible && (
        <div className={styles.text__row}>
          {/* {(!isExpaned || isOverHeight) && <p className={classNames(styles.text__dots, className)}>...</p>} */}
          <button onClick={onClickSeeMore} className={styles.text__button}>
            {isExpaned ? 'Hide' : 'See more'}
          </button>
          {isOverHeight && isExpaned && showAll && (
            <button onClick={showAll} className={classNames(styles.text__button, styles.text__showAll)}>
              Show all
            </button>
          )}
        </div>
      )}
    </div>
    // <>
    //   <div className={classNames(styles.text, isFullText && styles.fullText, onlyEmojis && styles.bigText, className)}>
    //     {refUser && (
    //       <span className={styles.text__userRef}>{refUser?.id && `@${refUser.first_name} ${refUser.last_name}`}</span>
    //     )}
    //     <div ref={textRef}>{emoji(text)}</div>
    //   </div>

    //   {height > 80 && (
    //     <>
    //       {!isFullText && <p className={styles.text__dots}>...</p>}
    //       <button onClick={onClickSeeeMore} className={styles.text__button}>
    //         {isFullText ? 'Show less' : 'Show more'}
    //       </button>
    //     </>
    //   )}
    // </>
  );
};

export default ExtensibleText;

// import React, { useState, useEffect, useRef } from 'react';

// type ExtensibleTextProps = {
//   text: string;
//   rowsDisplayed?: number;
//   maxRowsDisplayed?: number;
//   openPostDetails?: () => void;
// };

// const ExtensibleText: React.FC<ExtensibleTextProps> = ({
//   text,
//   rowsDisplayed = 4,
//   maxRowsDisplayed = 10,
//   openPostDetails,
// }) => {
//   const [showAll, setShowAll] = useState(false);
//   const [shouldTruncate, setShouldTruncate] = useState(false);
//   const textRef = useRef<HTMLDivElement>(null);

//   // Effect to check text overflow and whether to truncate
//   useEffect(() => {
//     if (textRef.current) {
//       const computedStyle = window.getComputedStyle(textRef.current);
//       const lineHeight = parseFloat(computedStyle.lineHeight);
//       const containerHeight = textRef.current.scrollHeight;
//       const totalRows = Math.floor(containerHeight / lineHeight);

//       // Determine whether to truncate text
//       setShouldTruncate(totalRows > rowsDisplayed);
//     }
//   }, [text, rowsDisplayed]);

//   const handleShowMore = () => {
//     setShowAll((prev) => !prev);
//   };

//   return (
//     <div>
//       <div
//         ref={textRef}
//         style={{
//           display: '-webkit-box',
//           WebkitLineClamp: !showAll ? rowsDisplayed : maxRowsDisplayed,
//           WebkitBoxOrient: 'vertical',
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//           whiteSpace: showAll ? 'normal' : 'nowrap',
//         }}
//       >
//         {text}
//       </div>
//       {shouldTruncate && (
//         <div>
//           {!showAll && (
//             <>
//               <span>...</span>
//               <button onClick={handleShowMore}>Show More</button>
//             </>
//           )}
//           {showAll && (
//             <>
//               {textRef.current &&
//                 textRef.current.scrollHeight >
//                   maxRowsDisplayed * parseFloat(window.getComputedStyle(textRef.current).lineHeight) && (
//                   <button onClick={openPostDetails}>Read More</button>
//                 )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExtensibleText;
