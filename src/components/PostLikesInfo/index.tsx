import React from 'react';
import classNames from 'classnames';

import { FavoriteSvg, LikeSvg } from '../../icons';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../redux';
import { IPost } from '../../redux/posts/types';
import { fetchFavoritePost, fetchLikePost } from '../../redux/posts/asyncActions';
import { selectAuthStatus } from '../../redux/auth/selectors';

interface IPostLikesInfo {
  post: IPost;
}

const PostLikesInfo: React.FC<IPostLikesInfo> = ({ post }) => {
  const { userId } = useSelector(selectAuthStatus);

  const dispatch = useAppDispatch();

  const checkPermission = () => {
    if (!userId) {
      toast.error('Sign In or Create an account to perform this action!');
    }
    return Boolean(userId);
  };

  const putLike = (isLike: boolean) => {
    if (checkPermission()) dispatch(fetchLikePost({ postId: post.id, like: isLike }));
  };

  const handlePutLike = () => putLike(true);
  const handlePutDislike = () => putLike(false);
  const handleFavoritePost = () => dispatch(fetchFavoritePost(post.id));

  return (
    <div className={styles.root}>
      <button className={classNames(styles.likes, post.liked && styles.active)} onClick={handlePutLike}>
        <LikeSvg />
        {post.likesCount}
      </button>
      <button className={classNames(styles.dislikes, post.disliked && styles.active)} onClick={handlePutDislike}>
        <LikeSvg />
        {post.dislikesCount}
      </button>
      <button className={classNames(styles.favorite, post.favorite && styles.active)} onClick={handleFavoritePost}>
        <FavoriteSvg />
      </button>
    </div>
  );
};

export default PostLikesInfo;
