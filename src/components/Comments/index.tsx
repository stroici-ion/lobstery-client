import React, { useEffect, useState } from 'react';
//must check
//@ts-ignore
import capitalize from 'lodash.capitalize';

import FeetchedComments from './core/FeetchedComments';
import RecentComments from './core/RecentComments';
import styles from './styles.module.scss';
import { SortSvg } from '../../icons';
import ContextMenu from '../ContextMenu';
import { IComment } from '../../models/comments/IComment';
import { IUser } from '../../models/IUser';

interface IComments {
  hideComments: () => void;
  id: number;
  isMultimedia?: boolean;
  owner: IUser;
}

export enum SortCommentsByEnum {
  MOST_RELEVANT = 'most_relevant',
  NEWEST = 'newest',
  ALL_COMMENTS = 'all_comments',
}

const Comments: React.FC<IComments> = ({ id, owner, isMultimedia = false, hideComments }) => {
  const [sortBy, setSortBy] = useState(SortCommentsByEnum.MOST_RELEVANT);
  const [pinnedComment, setPinnedComment] = useState<IComment>();

  return (
    <div className={styles.root}>
      <div className={styles.root__top}>
        <ContextMenu
          className={styles.sortTypes}
          openButton={(onClick: any) => (
            <button className={styles.root__sortBy} onClick={onClick}>
              {capitalize(sortBy.replace('_', ' '))}
              <SortSvg />
            </button>
          )}
        >
          <button
            className={styles.sortTypes__button}
            onClick={() => setSortBy(SortCommentsByEnum.MOST_RELEVANT)}
          >
            {capitalize(SortCommentsByEnum.MOST_RELEVANT.replace('_', ' '))}
          </button>
          <button
            className={styles.sortTypes__button}
            onClick={() => setSortBy(SortCommentsByEnum.NEWEST)}
          >
            {capitalize(SortCommentsByEnum.NEWEST.replace('_', ' '))}
          </button>
          <button
            className={styles.sortTypes__button}
            onClick={() => setSortBy(SortCommentsByEnum.ALL_COMMENTS)}
          >
            {capitalize(SortCommentsByEnum.ALL_COMMENTS.replace('_', ' '))}
          </button>
        </ContextMenu>
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
  );
};

export default Comments;
