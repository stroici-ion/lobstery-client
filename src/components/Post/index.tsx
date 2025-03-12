import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import toast from 'react-hot-toast';

import { getLikes } from '../../utils/getLikesCount';
import { getTime } from '../../utils/getTime';
import ExtensibleText from '../Comments/core/ExtensibleText';
// import ContextMenu from '../ContextMenu';
import DeleteSvg from '../../icons/DeleteSvg';
import getViews from '../../utils/getViews';
import Comments from '../Comments';
import styles from './styles.module.scss';
import {
  ArrowDownSvg,
  EditSvg,
  FriendsSvg,
  GlobeSvg,
  KnownsSvg,
  LockSvg,
  MessagingSvg,
  ReportSvg,
  SettingsSvg,
  SubmenuSvg,
  ViewsSvg,
} from '../../icons';
import dialogBtnStyles from '../../styles/components/buttons/solidLightButtons.module.scss';
import { EnumModalDialogOptionType, useModalDialog } from '../../hooks/useModalDialog';
import ctxBtnStyles from '../../styles/components/buttons/contextButtons.module.scss';
import { useAppDispatch } from '../../redux';
import { selectUserProfile } from '../../redux/profile/selectors';
import { POSTS_ROUTE } from '../../utils/consts';
import { IPost } from '../../redux/posts/types';
import PostLikesInfo from '../PostLikesInfo';
import PostUsername from '../PostUsername';
import { fetchRemovePost } from '../../redux/posts/asyncActions';
import UserImage from '../UserImage';
import AddPostForm from '../AddPostForm';
import Modal from '../UI/modals/Modal';
import { dirtyFormWarningDialog } from '../UI/modals/dialog-options';
import { setActivePost } from '../../redux/posts/slice';
import ImageGrid from '../media/ImageGrid';
import RippleButton from '../UI/buttons/RippleButton';
import { useContextMenu } from '../../hooks/useContextMenu';
import ContextMenu from '../UI/ContextMenu';

interface IPostFC {
  small?: boolean;
  post: IPost;
  className?: string;
}

const Post: React.FC<IPostFC> = ({ post, small = false, className }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const userProfile = useSelector(selectUserProfile);
  const editModal = useModalDialog();
  const dialogModal = useModalDialog();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleRemovePost = async () => {
    const dialogParams = {
      isMain: true,
      title: 'Delete post?',
      description: 'Are you sure you want to delete this post?',
      options: [
        {
          type: EnumModalDialogOptionType.OTHER,
          title: 'Yes',
          callback: async () => {
            await dispatch(fetchRemovePost(post.id));
            toast.success('Post was successfully deleted');
          },
          className: dialogBtnStyles.redSolid,
        },
        {
          type: EnumModalDialogOptionType.RETURN,
          title: 'No',
          className: dialogBtnStyles.greenSolid,
          callback: () => dialogModal.onHide(),
        },
      ],
    };
    dialogModal.dialog.setDialogParams(dialogParams);
    dialogModal.open();
  };

  const handleEditPost = () => {
    const dialogParams = {
      isMain: true,
      title: 'Edit post?',
      description: 'Are you sure you want to edit this post?',
      options: [
        {
          type: EnumModalDialogOptionType.OTHER,
          title: 'Yes',
          callback: () => {
            dispatch(setActivePost(post));
            editModal.open();
          },
          className: dialogBtnStyles.orangeLight,
        },
        {
          type: EnumModalDialogOptionType.RETURN,
          title: 'No',
          className: dialogBtnStyles.greenSolid,
          callback: () => dialogModal.onHide(),
        },
      ],
    };
    dialogModal.dialog.setDialogParams(dialogParams);
    dialogModal.open();
  };

  const handleReportPost = () => {
    toast.success('Post was reported');
  };

  const handleToggleComments = () => {
    if (isCommentsVisible)
      scrollRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    setIsCommentsVisible(!isCommentsVisible);
  };

  const handleViewPost = () => {
    navigate(POSTS_ROUTE + post.id);
  };

  // useEffect(() => {
  //   if (isAddPostFormDirty) editModal.dialog.setDialogParams(dirtyFormWarningDialog);
  //   else editModal.dialog.setDialogParams(undefined);
  // }, [editModal.dialog, isAddPostFormDirty]);

  const ctx = useContextMenu();
  const audienceCtx = useContextMenu();

  return (
    <>
      <Modal {...dialogModal} />
      <Modal {...editModal}>{<AddPostForm onHide={editModal.onHide} forceHide={editModal.forceHide} />}</Modal>
      <div className={classNames(styles.post, className)}>
        <div className={styles.scrollRef} ref={scrollRef} />

        <div className={styles.post__content}>
          <div className={styles.post__top}>
            <div className={styles.post__top_right}>
              <UserImage user={post.user} className={styles.post__avatar} />
              <div className={styles.post__info}>
                <PostUsername user={post.user} feeling={post.feeling} taggedFriends={post.taggedFriends} />
                <div className={styles.post__date}>
                  {getTime(post.createdAt.toString())} <span>•</span>
                  {userProfile.user.id === post.user.id ? (
                    <></>
                  ) : (
                    <>
                      <button
                        ref={audienceCtx.triggerRef}
                        onClick={audienceCtx.onShow}
                        className={styles.post__audienceButton}
                      >
                        {post.audience === 0 && <LockSvg />}
                        {post.audience === 1 && <GlobeSvg />}
                        {post.audience === 2 && <FriendsSvg />}
                        {post.audience === 3 && <KnownsSvg />}
                        {post.audience === 4 && <SettingsSvg />}
                      </button>
                      {audienceCtx.isOpen && (
                        <ContextMenu {...audienceCtx}>
                          <button className={ctxBtnStyles.panel1Red}>
                            <LockSvg />
                            Private
                          </button>
                          <button className={ctxBtnStyles.panel1Green}>
                            <GlobeSvg />
                            Public
                          </button>
                          <button className={ctxBtnStyles.panel1Blue}>
                            <FriendsSvg />
                            Friends
                          </button>
                          <button className={ctxBtnStyles.panel1Blue}>
                            <KnownsSvg />
                            Friends of friends
                          </button>
                          <button className={ctxBtnStyles.panel1Yellow}>
                            <SettingsSvg />
                            Custom
                          </button>
                        </ContextMenu>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <RippleButton className={styles.post__contextMenuButton} triggerRef={ctx.triggerRef} onClick={ctx.onShow}>
              <SubmenuSvg />
            </RippleButton>
            {ctx.isOpen && (
              <ContextMenu {...ctx}>
                {userProfile.user.id === post.user.id ? (
                  <>
                    <button className={ctxBtnStyles.panel1Orange} onClick={handleEditPost}>
                      <EditSvg />
                      Edit post
                    </button>
                    <button className={ctxBtnStyles.panel1Red} onClick={handleRemovePost}>
                      <DeleteSvg />
                      Delete post
                    </button>
                  </>
                ) : (
                  <button className={ctxBtnStyles.panel1Red} onClick={handleReportPost}>
                    <ReportSvg />
                    Report post
                  </button>
                )}
              </ContextMenu>
            )}
          </div>
          <div className={styles.post__text}>
            <Link to={`${POSTS_ROUTE}/${post.id}`}>
              <h4 className={styles.post__title}>{post.title}</h4>
            </Link>

            <ExtensibleText text={post.text} className={styles.post__description} showAll={handleViewPost} />
          </div>
          <ImageGrid images={post.imageSet} orderedGrid={post.imagesLayout} />
          {/* <ImagesPreview images={post.imageSet} onSelect={handleSelectImage} /> */}
          <div className={styles.post__body}>
            {post.tags.length > 0 && (
              <p className={styles.post__tags}>
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </p>
            )}
            <div className={styles.post__bottom}>
              <div className={styles.post__bottom_right}>
                <PostLikesInfo post={post} />
                <button className={styles.post__comments} onClick={handleToggleComments}>
                  <MessagingSvg />
                  <span>{post.commentsCount === 0 ? 'Comment' : 'Comments'}</span>
                  {post.commentsCount > 0 && getLikes(post.commentsCount)}
                  <span className={classNames(styles.post__commentsArrowSvg, isCommentsVisible && styles.active)}>
                    <ArrowDownSvg />
                  </span>
                </button>
              </div>
              <div className={styles.post__views}>
                <ViewsSvg />
                {getViews(post.viewsCount)}
              </div>
            </div>
          </div>
        </div>
        {isCommentsVisible && (
          <Comments
            commentsCount={post.commentsCount}
            hideComments={handleToggleComments}
            owner={post.user}
            id={post.id}
          />
        )}
      </div>
    </>
  );
};

export default Post;
