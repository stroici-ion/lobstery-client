import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { LikeSvg } from '../../icons';
import { putLikePost } from '../../services/PostServices';
import styles from './styles.module.scss';
import { ILikesInfo } from '../../models/comments/IComment';
import { useAppDispatch } from '../../redux';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../redux/auth/selectors';
import toast from 'react-hot-toast';

interface IPostLikesInfo {
  id?: number;
  likesInfo: ILikesInfo;
}

const PostLikesInfo: React.FC<IPostLikesInfo> = ({ likesInfo, id }) => {
  const [localLikesInfo, setLocalLikesInfo] = useState(likesInfo);

  const userId = useSelector(selectUserId);
  const isAuthorized = !!userId;

  const checkPermission = () => {
    if (!isAuthorized) {
      toast.error('Sign In or Create an account to perform this action!');
    }
    return isAuthorized;
  };

  useEffect(() => {
    setLocalLikesInfo(likesInfo);
  }, [likesInfo]);

  const handlePutLike = () => {
    if (id && checkPermission()) putLikePost(id, true).then((res) => res && setLocalLikesInfo(res));
  };

  const handlePutDislike = () => {
    if (id && checkPermission()) putLikePost(id, false).then((res) => res && setLocalLikesInfo(res));
  };

  return (
    <div className={styles.root}>
      <button className={classNames(styles.likes, localLikesInfo.liked && styles.active)} onClick={handlePutLike}>
        <LikeSvg />
        {localLikesInfo.likes_count}
      </button>
      <button
        className={classNames(styles.likes, styles.dislikes, localLikesInfo.disliked && styles.active)}
        onClick={handlePutDislike}
      >
        <LikeSvg />
        {localLikesInfo.dislikes_count}
      </button>
    </div>
  );
};

export default PostLikesInfo;
