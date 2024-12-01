import React, { useEffect, useRef, useState } from 'react';
import { SortCommentsByEnum } from '../..';
import { ReturnBackSvg } from '../../../../icons';
import { IComment } from '../../types';
import { IUser } from '../../../../redux/profile/types';

import { getComments } from '../../../../services/comments/CommentsServices';
import Loader from '../../../Loader';
import Comment from '../Comment';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../../../redux/auth/selectors';
import CommentSkeleton from '../Comment/CommentSkeleton';
import { selectUserProfile } from '../../../../redux/profile/selectors';

interface IRecentComments {
  commentsCount: number;
  sortBy: SortCommentsByEnum;
  isMultimedia: boolean;
  postId: number;
  owner: IUser;
  setPinnedComment: React.Dispatch<React.SetStateAction<IComment | undefined>>;
}

const RecentComments: React.FC<IRecentComments> = ({
  commentsCount,
  sortBy,
  postId,
  owner,
  isMultimedia,
  setPinnedComment,
}) => {
  const [fetchedComments, setFetchedComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState<number>(1);
  const isFetched = useRef(false);
  const user = useSelector(selectUserProfile).user;

  useEffect(() => {
    setIsLoading(true);
    setFetchedComments([]);
    if (page === 1) fetchComments();

    setPage(1);
  }, [sortBy]);

  useEffect(() => {
    if (isFetched.current) fetchComments();
  }, [page]);

  const fetchComments = async () => {
    const res = await getComments(postId, page, sortBy, user.id);
    if (res) {
      if (!count) setCount(res.count);
      if (page === 1) {
        setFetchedComments(res.results);
      } else {
        setFetchedComments([...fetchedComments, ...res.results]);
      }
      const pinnedComment = res.results.find((comment) => comment.isPinnedByAuthor);
      if (pinnedComment) {
        setPinnedComment(pinnedComment);
      }
    }
    setIsLoading(false);
    isFetched.current = true;
  };

  if (isLoading)
    return (
      <>
        {Array.from({ length: commentsCount }).map((_, i) => (
          <div key={i} className={styles.root}>
            <CommentSkeleton />
          </div>
        ))}
      </>
    );

  return (
    <div className={styles.root}>
      {fetchedComments.length === 0 && <p className={styles.root__empty} children={'No comments...'} />}
      {fetchedComments
        .filter((comment) => !!comment.isPinnedByAuthor === false)
        .map((comment) => (
          <Comment
            isMultimedia={isMultimedia}
            setComments={setFetchedComments}
            setPinnedComment={setPinnedComment}
            owner={owner}
            key={comment.id}
            postId={postId}
            comment={comment}
          />
        ))}
      {sortBy !== SortCommentsByEnum.TOP_COMMENTS && count > fetchedComments.length && (
        <button className={styles.root__moreComments} onClick={() => setPage(page + 1)}>
          <span>•••</span>
          <ReturnBackSvg />
          View more comments
        </button>
      )}
    </div>
  );
};

export default RecentComments;
