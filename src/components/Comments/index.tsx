import React, { useEffect, useState } from 'react';
//must check
//@ts-ignore
import capitalize from 'lodash.capitalize';

import FeetchedComments from './core/FeetchedComments';
import RecentComments from './core/RecentComments';
import styles from './styles.module.scss';
import { SortSvg } from '../../icons';
import { IComment } from './types';
import { IUser } from '../../redux/profile/types';
import ContextMenu from '../UI/ContextMenu';
import { useContextMenu } from '../../hooks/useContextMenu';
import classNames from 'classnames';

interface IComments {
  hideComments: () => void;
  id: number;
  isMultimedia?: boolean;
  owner: IUser;
  commentsCount: number;
}

export enum SortCommentsByEnum {
  TOP_COMMENTS = 'top_comments',
  NEWEST_FIRST = 'newest_first',
}

const Comments: React.FC<IComments> = ({ commentsCount, id, owner, isMultimedia = false, hideComments }) => {
  const [sortBy, setSortBy] = useState(SortCommentsByEnum.TOP_COMMENTS);
  const [pinnedComment, setPinnedComment] = useState<IComment>();

  const { triggerRef, onShow, isOpen, onHide, position } = useContextMenu();

  return (
    <>
      {isOpen && (
        <ContextMenu className={styles.sortTypes} onHide={onHide} position={position}>
          <button className={styles.sortTypes__button} onClick={() => setSortBy(SortCommentsByEnum.TOP_COMMENTS)}>
            {capitalize(SortCommentsByEnum.TOP_COMMENTS.replace('_', ' '))}
          </button>
          <button className={styles.sortTypes__button} onClick={() => setSortBy(SortCommentsByEnum.NEWEST_FIRST)}>
            {capitalize(SortCommentsByEnum.NEWEST_FIRST.replace('_', ' '))}
          </button>
        </ContextMenu>
      )}

      <div className={styles.root}>
        <div className={styles.root__top}>
          <button
            ref={triggerRef}
            className={classNames(styles.root__sortBy, isOpen && styles.active)}
            onClick={onShow}
          >
            {capitalize(sortBy.replace('_', ' '))}
            <SortSvg />
          </button>
        </div>
        <RecentComments
          sortBy={sortBy}
          isMultimedia={isMultimedia}
          owner={owner}
          postId={id}
          pinnedComment={pinnedComment}
          setPinnedComment={setPinnedComment}
        />
        <FeetchedComments
          commentsCount={commentsCount}
          sortBy={sortBy}
          setPinnedComment={setPinnedComment}
          isMultimedia={isMultimedia}
          owner={owner}
          postId={id}
        />
        <div className={styles.root__bottom}>
          <button className={styles.root__hide} onClick={hideComments}>
            Hide Comments
          </button>
        </div>
      </div>
    </>
  );
};

export default Comments;
