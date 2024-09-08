import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { getLikes } from '../../utils/getLikesCount';
import { getTime } from '../../utils/getTime';
import CommentText from '../Comments/core/CommentText';
import ContextMenu from '../ContextMenu';
import DeleteSvg from '../../icons/DeleteSvg';
import getViews from '../../utils/getViews';
import Comments from '../Comments';
import styles from './styles.module.scss';
import {
  EditSvg,
  FriendsSvg,
  GlobeSvg,
  KnownsSvg,
  LockSvg,
  MessagingSvg,
  ReportSvg,
  SettingsSvg,
  ViewsSvg,
} from '../../icons';
import { useAppDispatch } from '../../redux';
import { selectUserProfile } from '../../redux/profile/selectors';
import { USER_PROFILE_ROUTE } from '../../utils/consts';
import { IPost } from '../../models/IPost';
import ImagesPreview from '../ImagesPreview';
import PostLikesInfo from '../PostLikesInfo';
import { fetchDeletePost } from '../../services/PostServices';
import PostUsername from '../PostUsername';
// import { setIsEditing, setNewPost } from '../../redux/app/slice';
// import { selectExistsNewPostDraft } from '../../redux/app/selectors';
import classNames from 'classnames';
import { IImage } from '../../models/IImage';
import { setActiveImageId, setImages } from '../../redux/images/slice';
import { setImagesModalStatus, setPostCreateModalStatus } from '../../redux/modals/slice';
import { fetchRemovePost } from '../../redux/posts/asyncActions';
import { setPostToEdit } from '../../redux/posts/slice';
import SmallButton from '../UI/Buttons/SmallButton';

interface IPostFC {
  small?: boolean;
  post: IPost;
  className?: string;
}

const Post: React.FC<IPostFC> = ({ post, small = false, className }) => {
  const dispatch = useAppDispatch();
  // const existsNewPostDraft = useSelector(selectExistsNewPostDraft);
  const navigate = useNavigate();
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const userProfile = useSelector(selectUserProfile);

  const handleRemovePost = async () => {
    dispatch(fetchRemovePost(post.id));
    // showModal(MODAL_TYPES.DIALOG_MODAL, {
    //   title: 'Are you sure you want to delete this post?',
    //   callBack: () =>
    // dispatch(),
    // });
  };

  const handleEditPost = () => {
    // dispatch(setIsEditing(true));
    // dispatch(setNewPost(post));
    dispatch(setPostCreateModalStatus(true));
    dispatch(setPostToEdit(post));
  };

  const onClickFetchPosts = (tag: string) => {
    // dispatch(setTag(tag));
    // navigate('/');
  };

  const handleViewComments = () => {
    setIsCommentsVisible(!isCommentsVisible);
  };

  const handleSetPost = (imageId: string) => {
    // dispatch(setPost({ post, imageId }));
  };

  const handleSelectImage = (image: IImage) => {
    dispatch(setImages(post.image_set));
    dispatch(setActiveImageId(image.id));
    dispatch(setImagesModalStatus(true));
  };

  if (!userProfile?.id) return <></>;

  return (
    <div className={classNames(styles.post, className)}>
      <div className={styles.post__content}>
        <div className={styles.post__top}>
          <div className={styles.post__top_right}>
            <img
              onClick={() => {
                navigate(USER_PROFILE_ROUTE + '/' + post.user.id);
              }}
              src={post.user.profile?.avatar_thumbnail}
              className={styles.post__avatar}
            />
            <div className={styles.post__info}>
              <PostUsername user={post.user} feeling={post.feeling} taggedFriends={post.tagged_friends} />
              <div className={styles.post__date}>
                {getTime(post.created_at.toString())} <span>•</span>
                {userProfile?.id === post.user.id ? (
                  <ContextMenu
                    className={styles.post__submenu}
                    openButton={(onClick: any) => (
                      <SmallButton onClick={onClick} className={styles.post__audienceBtn}>
                        {post.audience === 0 && <LockSvg />}
                        {post.audience === 1 && <GlobeSvg />}
                        {post.audience === 2 && <FriendsSvg />}
                        {post.audience === 3 && <KnownsSvg />}
                        {post.audience === 4 && <SettingsSvg />}
                      </SmallButton>
                    )}
                  >
                    <button className={styles.private}>
                      <LockSvg />
                      Private
                    </button>
                    <button className={styles.public}>
                      <GlobeSvg />
                      Public
                    </button>
                    <button className={styles.friends}>
                      <FriendsSvg />
                      Friends
                    </button>
                    <button className={styles.friendsOfFriends}>
                      <KnownsSvg />
                      Friends of friends
                    </button>
                    <button className={styles.custom}>
                      <SettingsSvg />
                      Custom
                    </button>
                  </ContextMenu>
                ) : (
                  <>
                    {post.audience === 0 && <LockSvg />}
                    {post.audience === 1 && <GlobeSvg />}
                    {post.audience === 2 && <FriendsSvg />}
                    {post.audience === 3 && <KnownsSvg />}
                    {post.audience === 4 && <SettingsSvg />}
                  </>
                )}
              </div>
            </div>
          </div>
          <ContextMenu className={styles.post__submenu}>
            {userProfile?.id === post.user.id ? (
              <>
                <button className={styles.submenu__edit} onClick={handleEditPost}>
                  <EditSvg />
                  Edit post
                </button>
                <button className={styles.submenu__delete} onClick={handleRemovePost}>
                  <DeleteSvg />
                  Delete post
                </button>
              </>
            ) : (
              <button className={styles.submenu__delete} onClick={handleRemovePost}>
                <ReportSvg />
                Report post
              </button>
            )}
          </ContextMenu>
        </div>
        <div className={styles.post__text}>
          <h4 className={styles.post__title}>{post.title}</h4>
          <CommentText text={post.text} />
        </div>
        <div>
          {/* WEGEWGEWGWEGHW */}
          <ImagesPreview images={post.image_set} onSelect={handleSelectImage} />
        </div>
        <div className={styles.post__body}>
          {post.tags.length > 0 && (
            <p className={styles.post__tags}>
              {post.tags.map((tag) => (
                <span key={tag} onClick={() => onClickFetchPosts(tag)}>
                  #{tag}
                </span>
              ))}
            </p>
          )}
          <div className={styles.post__bottom}>
            <div className={styles.post__bottom_right}>
              <PostLikesInfo
                id={post.id}
                likesInfo={{
                  liked: post.liked,
                  disliked: post.disliked,
                  likes_count: post.likes_count,
                  dislikes_count: post.dislikes_count,
                }}
              />
              <button className={styles.post__comments} onClick={handleViewComments}>
                <MessagingSvg />
                <span>
                  {post.comments_count === 0 ? 'Leave Comment' : <>{isCommentsVisible ? 'Hide' : 'Show'} Comments</>}
                </span>
                {post.comments_count > 0 && getLikes(post.comments_count)}
              </button>
            </div>
            <div className={styles.post__views}>
              <ViewsSvg />
              {getViews(post.viewsCount)}
            </div>
          </div>
        </div>
      </div>
      {isCommentsVisible && <Comments hideComments={handleViewComments} owner={post.user} id={post.id} />}
    </div>
  );
};

export default Post;
