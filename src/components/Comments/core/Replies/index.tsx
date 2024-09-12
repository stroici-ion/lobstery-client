import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ArrowDownSvg, ReturnBackSvg } from '../../../../icons';
import { createReply, getReplies } from '../../../../services/CommentsServices';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import WriteComment from '../WriteComment';
import { IUser } from '../../../../models/IUser';
import styles from './styles.module.scss';
import Reply from '../Reply';
import { IReply } from '../../../../models/comments/IComment';
import Loader from '../../../Loader';
import UserImage from '../../../UserImage';

interface IReplies {
  isMultimedia: boolean;
  owner: IUser;
  isRepliedByAuthor: boolean;
  repliesCount: number;
  commentId: number;
  isCreateReplyVisible: boolean;
  setIsCreateReplyVisible: React.Dispatch<React.SetStateAction<boolean>>;
  postId: number;
}

const Replies: React.FC<IReplies> = ({
  isMultimedia,
  owner,
  commentId,
  postId,
  isCreateReplyVisible,
  isRepliedByAuthor,
  setIsCreateReplyVisible,
  repliesCount,
}) => {
  const user = useSelector(selectUserProfile);

  const [isCreateReplyLoading, setIsCreateReplyLoading] = useState(false);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const [isFetchedRepliesVisible, setIsFetchedRepliesVisible] = useState(false);
  const [recentReplies, setRecentReplies] = useState<IReply[]>([]);
  const [feetchedReplies, setFeetchedReplies] = useState<IReply[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const totalPages = Math.ceil(repliesCount / limit);

  const handleCreateReply = async (text: string) => {
    if (user) {
      setIsCreateReplyLoading(true);
      const res = await createReply({ text, post: postId, parent: commentId, user: user.id });
      if (res) {
        const newReply: IReply = {
          ...res,
          liked_by_author: false,
          likes_count: 0,
          dislikes_count: 0,
          liked: false,
          disliked: false,
          //must chkeck later
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            profile: user.profile && {
              avatar: user.profile.avatar,
              avatar_thumbnail: user.profile.avatar_thumbnail,
              cover: user.profile.cover,
            },
          },
        };
        setRecentReplies([...recentReplies, newReply]);
      }
      setIsCreateReplyLoading(false);
      setIsCreateReplyVisible(false);
    }
  };

  useEffect(() => {
    if (isFetchedRepliesVisible && !feetchedReplies.length) {
      setIsRepliesLoading(true);
      getReplies(commentId, page, user.id).then((replies) => {
        if (replies) setFeetchedReplies([...feetchedReplies, ...replies.results]);
        setIsRepliesLoading(false);
      });
    }
  }, [isFetchedRepliesVisible]);

  useEffect(() => {
    if (feetchedReplies.length) {
      setIsRepliesLoading(true);
      getReplies(commentId, page, user.id).then((replies) => {
        if (replies) setFeetchedReplies([...feetchedReplies, ...replies.results]);
        setIsRepliesLoading(false);
      });
    }
  }, [page]);

  return (
    <div className={styles.root}>
      {isCreateReplyLoading ? (
        <Loader height={83} size={80} />
      ) : (
        isCreateReplyVisible && (
          <WriteComment isReply={true} hide={() => setIsCreateReplyVisible(false)} sendComment={handleCreateReply} />
        )
      )}
      {repliesCount > 0 && (
        <button className={styles.root__button} onClick={() => setIsFetchedRepliesVisible(!isFetchedRepliesVisible)}>
          <ArrowDownSvg />
          {isRepliedByAuthor && (
            <>
              <UserImage user={owner} className={styles.root__avatar} />
              <span className={styles.root__avatarDecoration}>•</span>
            </>
          )}
          View {repliesCount} {`repl${repliesCount > 1 ? 'ies' : 'y'}`}
        </button>
      )}
      {isFetchedRepliesVisible && (
        <>
          {feetchedReplies
            .filter((reply) => !recentReplies.map((recent) => recent.id).includes(reply.id))
            .map((reply) => (
              <Reply
                postId={postId}
                isMultimedia={isMultimedia}
                setFeetchedReplies={setFeetchedReplies}
                setRecentReplies={setRecentReplies}
                key={reply.id}
                commentId={commentId}
                reply={reply}
                owner={owner}
              />
            ))}
          {recentReplies.map((reply) => (
            <Reply
              postId={postId}
              isMultimedia={isMultimedia}
              setRecentReplies={setRecentReplies}
              key={reply.id}
              commentId={commentId}
              owner={owner}
              reply={reply}
            />
          ))}
          {isRepliesLoading ? (
            <Loader height={91} size={80} />
          ) : (
            totalPages > page && (
              <button className={styles.root__showMoreButton} onClick={() => setPage(page + 1)}>
                <ReturnBackSvg />
                Show more replies
              </button>
            )
          )}
        </>
      )}
      {!isFetchedRepliesVisible &&
        recentReplies.map((reply) => (
          <Reply
            postId={postId}
            isMultimedia={isMultimedia}
            owner={owner}
            setRecentReplies={setRecentReplies}
            key={reply.id}
            commentId={commentId}
            reply={reply}
          />
        ))}
    </div>
  );
};

export default Replies;
