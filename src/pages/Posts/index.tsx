import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../redux';
import { getIsDirty, selectActivePost, selectPosts } from '../../redux/posts/selectors';
import { fetchPosts } from '../../redux/posts/asyncActions';
import { setActivePostNull } from '../../redux/posts/slice';
import { selectAuthStatus, selectUserId } from '../../redux/auth/selectors';
import { FetchStatusEnum } from '../../models/response/FetchStatus';
import Modal from '../../components/UI/modals/Modal';
import DialogModalForm from '../../components/UI/modals/forms/DialogModalForm';
import AddPostForm from '../../components/AddPostForm';
import Post from '../../components/Post';
import { PlusSvg } from '../../icons';
import styles from './styles.module.scss';
import { useModalDialogYeReturn } from '../../hooks/useModalDialogYeReturn';
import { EnumModalDialogOptionType, IModalDialogType, useModalDialog } from '../../hooks/useModalDialog';

const Posts: React.FC = () => {
  const posts = useSelector(selectPosts);
  const dispatch = useAppDispatch();
  const authorizationStatus = useSelector(selectAuthStatus);
  const userId = useSelector(selectUserId);
  const pendingAuth = authorizationStatus === FetchStatusEnum.PENDING;
  const isAddPostFormDirty = useSelector(getIsDirty);

  useEffect(() => {
    if (pendingAuth) return;
    if (userId) {
      dispatch(fetchPosts({ user: `${userId}` }));
    } else {
      dispatch(fetchPosts({}));
    }
  }, [pendingAuth, userId, dispatch]);

  const [modalDialog, setModalDialog] = useState<IModalDialogType>();

  const modal = useModalDialog(modalDialog);

  useEffect(() => {
    console.log('Is Dirty');
    if (isAddPostFormDirty)
      setModalDialog({
        title: 'Are you sure ypu want to leave?',
        description: 'If you leave, changes will be lost!',
        options: [
          {
            type: EnumModalDialogOptionType.OTHER,
            title: 'Yes',
            callback: () => {},
            className: styles.dialogOptions__yes,
          },
          {
            type: EnumModalDialogOptionType.RETURN,
            title: 'Return',
            callback: () => {},
            className: styles.dialogOptions__return,
          },
        ],
      });
    else setModalDialog(undefined);
  }, [isAddPostFormDirty]);

  const handleShowAddPostModal = () => {
    if (userId) {
      dispatch(setActivePostNull());
      modal.open();
    } else {
      toast.error('You are not authorized');
    }
  };

  return (
    <>
      <Modal {...modal}>
        <AddPostForm onHide={modal.onHide} />
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
