import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../redux';
import { getIsPostFormDirty, selectPosts } from '../../redux/posts/selectors';
import { fetchPosts } from '../../redux/posts/asyncActions';
import { selectAuthStatus, selectUserId } from '../../redux/auth/selectors';
import { FetchStatusEnum } from '../../models/response/FetchStatus';
import Modal from '../../components/UI/modals/Modal';
import AddPostForm from '../../components/AddPostForm';
import Post from '../../components/Post';
import { PlusSvg } from '../../icons';
import styles from './styles.module.scss';
import { useModalDialog } from '../../hooks/useModalDialog';
import { dirtyFormWarningDialog } from '../../components/UI/modals/dialog-options';
import { setActivePost } from '../../redux/posts/slice';

const Posts: React.FC = () => {
  const posts = useSelector(selectPosts);
  const dispatch = useAppDispatch();
  const authorizationStatus = useSelector(selectAuthStatus);
  const userId = useSelector(selectUserId);
  const pendingAuth = authorizationStatus === FetchStatusEnum.PENDING;
  const isAddPostFormDirty = useSelector(getIsPostFormDirty);

  useEffect(() => {
    if (pendingAuth) return;
    if (userId) {
      dispatch(fetchPosts({ user: `${userId}` }));
    } else {
      dispatch(fetchPosts({}));
    }
  }, [pendingAuth, userId, dispatch]);

  const modal = useModalDialog();

  useEffect(() => {
    if (isAddPostFormDirty) modal.dialog.setDialogParams(dirtyFormWarningDialog);
    else modal.dialog.setDialogParams(undefined);
  }, [isAddPostFormDirty]);

  const handleShowAddPostModal = () => {
    if (userId) {
      dispatch(setActivePost());
      modal.open();
    } else {
      toast.error('You are not authorized');
    }
  };

  return (
    <>
      <Modal {...modal}>
        <AddPostForm onHide={modal.onHide} forceHide={modal.forceHide} />
      </Modal>

      <div className={styles.root}>
        <div className={styles.root__posts}>
          {posts && posts.map((post) => <Post key={post.id} post={{ ...post, viewsCount: 10 }} />)}
        </div>

        <button className={styles.add_post_button} onClick={handleShowAddPostModal}>
          <PlusSvg />
        </button>
      </div>
    </>
  );
};

export default Posts;
