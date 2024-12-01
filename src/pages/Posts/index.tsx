import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { dirtyFormWarningDialog } from '../../components/UI/modals/dialog-options';
import { getIsPostFormDirty, selectPosts } from '../../redux/posts/selectors';
import { selectAuthStatus, selectUserId } from '../../redux/auth/selectors';
import { fetchPosts } from '../../redux/posts/asyncActions';
import { useModalDialog } from '../../hooks/useModalDialog';
import { setActivePost } from '../../redux/posts/slice';
import AddPostForm from '../../components/AddPostForm';
import Modal from '../../components/UI/modals/Modal';
import { EFetchStatus } from '../../types/enums';
import { useAppDispatch } from '../../redux';
import styles from './styles.module.scss';
import Post from '../../components/Post';
import { PlusSvg } from '../../icons';

const Posts: React.FC = () => {
  const posts = useSelector(selectPosts);
  const dispatch = useAppDispatch();
  const isAuth = useSelector(selectAuthStatus);
  const userId = useSelector(selectUserId);
  const isAddPostFormDirty = useSelector(getIsPostFormDirty);

  useEffect(() => {
    if (!isAuth) return;
    if (posts.length) return;
    if (userId) {
      dispatch(fetchPosts({ user: `${userId}` }));
    } else {
      dispatch(fetchPosts({}));
    }
  }, [isAuth, userId, dispatch]);

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
          {posts && posts.map((post) => <Post key={post.id} post={{ ...post, viewsCount: 999 }} />)}
        </div>

        <button className={styles.add_post_button} onClick={handleShowAddPostModal}>
          <PlusSvg />
        </button>
      </div>
    </>
  );
};

export default Posts;
