import React, { useState } from 'react';
import classNames from 'classnames';

import SmallButton from '../../../UI/buttons/SmallButton';
import { HeartSvg, LikeSvg } from '../../../../icons';
import styles from './styles.module.scss';
import { putCommentLike, putCommentLikeByAuthor } from '../../../../services/CommentsServices';
import { IUser } from '../../../../models/IUser';
import { ILikesInfo } from '../../../../models/comments/IComment';

interface ICommentActions {
  isMultimedia: boolean;
  isOwner: boolean;
  owner: IUser;
  id: number;
  isReply?: boolean;
  handleToggleCreateRelpy: () => void;
  setLikesInfo?: (
    fetchedLikesInfo: ILikesInfo & {
      liked_by_author: boolean;
    }
  ) => void;
  className?: string;
  likesInfo: ILikesInfo & {
    liked_by_author: boolean;
  };
}

const CommentActions: React.FC<ICommentActions> = ({
  isOwner,
  owner,
  handleToggleCreateRelpy,
  setLikesInfo,
  isReply = false,
  id,
  className,
  likesInfo,
  isMultimedia,
}) => {
  const [localLikesInfo, setLocalLikesInfo] = useState(likesInfo);

  const handlePutLike = async () => {
    if (isReply) {
      const feetchedLikesInfo = await putCommentLike(id, true);
      if (feetchedLikesInfo && setLikesInfo) {
        setLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
        setLocalLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
      }
      return;
    }
    const feetchedLikesInfo = await putCommentLike(id, true);
    if (feetchedLikesInfo) {
      setLocalLikesInfo({ ...localLikesInfo, ...feetchedLikesInfo });
    }
  };

  const handlePutDislike = async () => {
    if (isReply) {
      const feetchedLikesInfo = await putCommentLike(id, false);
      if (feetchedLikesInfo && setLikesInfo) {
        setLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
        setLocalLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
      }
      return;
    }
    const feetchedLikesInfo = await putCommentLike(id, false);
    if (feetchedLikesInfo) {
      setLocalLikesInfo({ ...likesInfo, ...feetchedLikesInfo });
    }
  };

  const handlePuteLikeByAuthor = async () => {
    if (isReply) {
      const response = await putCommentLikeByAuthor(id);

      if (response?.success && setLikesInfo) {
        setLikesInfo({
          ...likesInfo,
          liked_by_author: response.data.liked_by_author,
        });
        setLocalLikesInfo({
          ...likesInfo,
          liked_by_author: response.data.liked_by_author,
        });
      }
      return;
    }
    const response = await putCommentLikeByAuthor(id);

    if (response?.success) {
      setLocalLikesInfo({
        ...localLikesInfo,
        liked_by_author: response.data.liked_by_author,
      });
    }
  };

  return (
    <div className={classNames(className, styles.actions)}>
      <div className={classNames(styles.actions__like, localLikesInfo.liked && styles.active)}>
        <SmallButton onClick={handlePutLike}>
          <LikeSvg />
        </SmallButton>
        <span>{localLikesInfo.likes_count}</span>
      </div>
      <div className={classNames(styles.actions__dislike, localLikesInfo.disliked && styles.active)}>
        <SmallButton onClick={handlePutDislike}>
          <LikeSvg />
        </SmallButton>
        <span>{localLikesInfo.dislikes_count}</span>
      </div>
      {(isOwner || localLikesInfo.liked_by_author) && (
        <div
          className={classNames(
            styles.actions__likeByAuthor,
            isOwner && styles.editable,
            localLikesInfo.liked_by_author && styles.active
          )}
        >
          <SmallButton onClick={handlePuteLikeByAuthor}>
            <HeartSvg />
            <img src={owner.profile.avatar_thumbnail} />
          </SmallButton>
        </div>
      )}

      <button onClick={handleToggleCreateRelpy} className={styles.actions__reply}>
        Reply
      </button>
    </div>
  );
};

export default CommentActions;
