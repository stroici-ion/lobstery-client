import React, { useEffect, useRef, useState } from 'react';
import { SortCommentsByEnum } from '../..';
import { ReturnBackSvg } from '../../../../icons';
import { IComment } from '../../../../models/comments/IComment';
import { IUser } from '../../../../models/IUser';

import { getComments } from '../../../../services/CommentsServices';
import Loader from '../../../Loader';
import Comment from '../Comment';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../../../redux/auth/selectors';

interface IRecentComments {
  sortBy: SortCommentsByEnum;
  isMultimedia: boolean;
  postId: number;
  owner: IUser;
  setPinnedComment: React.Dispatch<React.SetStateAction<IComment | undefined>>;
}

const RecentComments: React.FC<IRecentComments> = ({ sortBy, postId, owner, isMultimedia, setPinnedComment }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feetchedComments, setFeetchedComments] = useState<IComment[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const isFeetched = useRef(false);
  const user = useSelector(selectUserId);

  useEffect(() => {
    setFeetchedComments([]);
    if (page === 1) fetchComments();
    setPage(1);
  }, [sortBy, postId]);

  useEffect(() => {
    if (isFeetched.current) fetchComments();
  }, [page]);

  const fetchComments = async () => {
    setIsLoading(true);
    const res = await getComments(postId, page, sortBy, user);
    if (res) {
      if (!count) setCount(res.count);
      if (page === 1) {
        setFeetchedComments(res.results);
      } else {
        setFeetchedComments([...feetchedComments, ...res.results]);
      }
      const pinnedComment = res.results.find((comment) => comment.is_pinned_by_author);
      if (pinnedComment) {
        setPinnedComment(pinnedComment);
      }
    }
    setIsLoading(false);
    isFeetched.current = true;
  };

  if (isLoading)
    return (
      <div className={styles.root}>
        <Loader height={40} size={35} />
      </div>
    );

  return (
    <div className={styles.root}>
      {feetchedComments.length === 0 && <p className={styles.root__empty} children={'No comments...'} />}
      {feetchedComments
        .filter((comment) => !!comment.is_pinned_by_author === false)
        .map((comment) => (
          <Comment
            isMultimedia={isMultimedia}
            setComments={setFeetchedComments}
            setPinnedComment={setPinnedComment}
            owner={owner}
            key={comment.id}
            postId={postId}
            comment={comment}
          />
        ))}
      {sortBy !== SortCommentsByEnum.MOST_RELEVANT && count > feetchedComments.length && (
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
