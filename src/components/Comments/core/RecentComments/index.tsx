import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { createComment } from '../../../../services/comments/CommentsServices';
import WriteComment from '../WriteComment';
import Comment from '../Comment';
import styles from './styles.module.scss';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import { IUser } from '../../../../redux/profile/types';
import Loader from '../../../Loader';
import { IComment } from '../../types';

interface IRecentComments {
  isMultimedia: boolean;
  sortBy: string;
  owner: IUser;
  postId: number;
  pinnedComment?: IComment | undefined;
  setPinnedComment: React.Dispatch<React.SetStateAction<IComment | undefined>>;
}

const RecentComments: React.FC<IRecentComments> = ({
  sortBy,
  pinnedComment,
  setPinnedComment,
  postId,
  owner,
  isMultimedia,
}) => {
  const userData = useSelector(selectUserProfile);
  const [recentComments, setRecentComments] = useState<IComment[]>([]);
  const [isCreateCommentLoading, setIsCreateCommentLoading] = useState(false);
  const [recentPinnedComments, setRecentPinnedComments] = useState<IComment[]>([]);

  useEffect(() => {
    setRecentComments([]);
    setRecentPinnedComments(pinnedComment ? [pinnedComment] : []);
  }, [sortBy, postId]);

  useEffect(() => {
    if (pinnedComment) {
      const pinnedCandidate = recentPinnedComments.find((comment) => comment.id === pinnedComment.id);
      if (!pinnedCandidate) {
        setRecentPinnedComments([
          pinnedComment,
          ...recentPinnedComments.map((comment) => {
            return { ...comment, is_replied_by_author: false };
          }),
        ]);
      } else {
        setRecentPinnedComments([
          pinnedCandidate,
          ...recentPinnedComments.filter((comment) => comment.id !== pinnedCandidate.id),
        ]);
      }
    }
  }, [pinnedComment]);

  const handleCreateComment = async (text: string) => {
    if (userData) {
      setIsCreateCommentLoading(true);
      const comment = await createComment({ text, post: postId });
      if (comment) setRecentComments([comment, ...recentComments]);
      setIsCreateCommentLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      {isCreateCommentLoading ? <Loader height={93} size={80} /> : <WriteComment sendComment={handleCreateComment} />}
      {recentPinnedComments.map((comment) => (
        <Comment
          isPinned={true}
          wasPinned={comment.id !== pinnedComment?.id}
          setPinnedComment={setPinnedComment}
          isMultimedia={isMultimedia}
          setComments={setRecentPinnedComments}
          owner={owner}
          key={comment.id}
          postId={postId}
          comment={comment}
        />
      ))}
      {recentComments
        .filter((comment) => !comment.isPinnedByAuthor)
        .map((comment) => (
          <Comment
            setPinnedComment={setPinnedComment}
            isMultimedia={isMultimedia}
            setComments={setRecentComments}
            owner={owner}
            key={comment.id}
            postId={postId}
            comment={comment}
          />
        ))}
    </div>
  );
};

export default RecentComments;
