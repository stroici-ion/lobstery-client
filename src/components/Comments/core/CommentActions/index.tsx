import React, { useState } from 'react';
import classNames from 'classnames';

import { HeartSvg, LikeSvg, ReplySvg } from '../../../../icons';
import styles from './styles.module.scss';
import { putCommentLike, putCommentLikeByAuthor } from '../../../../services/comments/CommentsServices';
import { IUser } from '../../../../redux/profile/types';
import UserImage from '../../../UserImage';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../../../redux/auth/selectors';
import toast from 'react-hot-toast';
import { ILikesInfo } from '../../../../types/LikesInfo.types';

interface ICommentActions {
  isMultimedia?: boolean;
  isOwner: boolean;
  owner: IUser;
  id: number;
  isReply?: boolean;
  handleToggleCreateReply: () => void;
  setLikesInfo?: (
    fetchedLikesInfo: ILikesInfo & {
      isLikedByAuthor: boolean;
    }
  ) => void;
  className?: string;
  likesInfo: ILikesInfo & {
    isLikedByAuthor: boolean;
  };
}

const CommentActions: React.FC<ICommentActions> = ({
  isOwner,
  owner,
  handleToggleCreateReply,
  setLikesInfo,
  isReply = false,
  id,
  className,
  likesInfo,
}) => {
  const [localLikesInfo, setLocalLikesInfo] = useState(likesInfo);

  const userId = useSelector(selectUserId);
  const isAuthorized = !!userId;

  const checkPermission = () => {
    if (!isAuthorized) {
      toast.error('Sign In or Create an account to perform this action!');
    }
    return isAuthorized;
  };

  const handlePutLike = async () => {
    if (!checkPermission()) return;
    if (isReply) {
      const fetchedLikesInfo = await putCommentLike(id, true);
      if (fetchedLikesInfo && setLikesInfo) {
        setLikesInfo({ ...likesInfo, ...fetchedLikesInfo });
        setLocalLikesInfo({ ...likesInfo, ...fetchedLikesInfo });
      }
      return;
    }
    const fetchedLikesInfo = await putCommentLike(id, true);
    if (fetchedLikesInfo) {
      setLocalLikesInfo({ ...localLikesInfo, ...fetchedLikesInfo });
    }
  };

  const handlePutDislike = async () => {
    if (!checkPermission()) return;
    if (isReply) {
      const fetchedLikesInfo = await putCommentLike(id, false);
      if (fetchedLikesInfo && setLikesInfo) {
        setLikesInfo({ ...likesInfo, ...fetchedLikesInfo });
        setLocalLikesInfo({ ...likesInfo, ...fetchedLikesInfo });
      }
      return;
    }
    const fetchedLikesInfo = await putCommentLike(id, false);
    if (fetchedLikesInfo) {
      setLocalLikesInfo({ ...likesInfo, ...fetchedLikesInfo });
    }
  };

  const handlePutLikeByAuthor = async () => {
    if (!checkPermission()) return;
    if (isReply) {
      const response = await putCommentLikeByAuthor(id);

      if (response?.success && setLikesInfo) {
        setLikesInfo({
          ...likesInfo,
          isLikedByAuthor: response.isLikedByAuthor,
        });
        setLocalLikesInfo({
          ...likesInfo,
          isLikedByAuthor: response.isLikedByAuthor,
        });
      }
      return;
    }
    const response = await putCommentLikeByAuthor(id);

    if (response?.success) {
      setLocalLikesInfo({
        ...localLikesInfo,
        isLikedByAuthor: response.isLikedByAuthor,
      });
    }
  };

  return (
    <div className={classNames(className, styles.actions)}>
      <div className={styles.actions__body}>
        <button
          className={classNames(styles.actions__likes, localLikesInfo.liked && styles.active)}
          onClick={handlePutLike}
        >
          <LikeSvg />
          {localLikesInfo.likesCount}
        </button>
        <button
          className={classNames(styles.actions__dislikes, localLikesInfo.disliked && styles.active)}
          onClick={handlePutDislike}
        >
          <LikeSvg />
          {localLikesInfo.dislikesCount}
        </button>
      </div>
      {(isOwner || localLikesInfo.isLikedByAuthor) && (
        <button
          onClick={handlePutLikeByAuthor}
          className={classNames(
            styles.actions__likeByAuthor,
            isOwner && styles.editable,
            localLikesInfo.isLikedByAuthor && styles.active
          )}
        >
          <UserImage user={owner} />
          <HeartSvg />
        </button>
      )}
      <button onClick={handleToggleCreateReply} className={styles.actions__reply}>
        <ReplySvg />
        Reply
      </button>
    </div>
  );
};

export default CommentActions;
