import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import {} from '../../redux/app/selectors';
import { useAppDispatch } from '../../redux';
import { selectPosts } from '../../redux/posts/selectors';
import { fetchPosts } from '../../redux/posts/asyncActions';
import Modal from '../../components/Modals/Modal';
import styles from './styles.module.scss';
import { PlusSvg } from '../../icons';
import AddPostForm from '../../components/AddPostForm';
import Post from '../../components/Post';
import { setPostCreateModalStatus } from '../../redux/modals/slice';
import { selectPostCreateModalStatus } from '../../redux/modals/selectors';
import { setActivePostNull } from '../../redux/posts/slice';
import { selectAuthStatus, selectUserId } from '../../redux/auth/selectors';
import toast from 'react-hot-toast';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

const Posts: React.FC = () => {
  const posts = useSelector(selectPosts);
  const dispatch = useAppDispatch();
  const postCreateModalStatus = useSelector(selectPostCreateModalStatus);

  const authorizationStatus = useSelector(selectAuthStatus);
  const pendingAuth = authorizationStatus === FetchStatusEnum.PENDING;
  const userId = useSelector(selectUserId);

  useEffect(() => {
    if (pendingAuth) return;
    if (userId) dispatch(fetchPosts({ user: `${userId}` }));
    else dispatch(fetchPosts({}));
  }, [pendingAuth, userId]);

  const handleShowAddPostModal = () => {
    if (userId) {
      dispatch(setPostCreateModalStatus(true));
      dispatch(setActivePostNull());
    } else toast.error('You are not authorized');
  };

  const handleHideModal = () => {
    dispatch(setPostCreateModalStatus(false));
  };

  return (
    <>
      {postCreateModalStatus && (
        <Modal onHide={handleHideModal}>
          <AddPostForm />
        </Modal>
      )}
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
