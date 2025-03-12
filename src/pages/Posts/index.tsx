import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectIsPostFormVisible, selectPostsStatus } from '../../redux/posts/selectors';
import { selectAuthStatus } from '../../redux/auth/selectors';
import { fetchPosts } from '../../redux/posts/asyncActions';
import { setIsPostFormVisible } from '../../redux/posts/slice';

import { useAppDispatch } from '../../redux';
import styles from './styles.module.scss';
import Post from '../../components/Post';
import { PlusSvg } from '../../icons';
import Container from '../../layouts/Container';
import { PostSkeleton } from '../../components/Post/Skeleton';

const Posts: React.FC = () => {
  const dispatch = useAppDispatch();

  const { userId } = useSelector(selectAuthStatus);

  const { posts, loading } = useSelector(selectPostsStatus);
  const isPostFormVisible = useSelector(selectIsPostFormVisible);

  useEffect(() => {
    if (!userId) return;
    if (posts.length) return;
    if (userId) {
      dispatch(fetchPosts({ user: userId.toString() }));
    } else {
      dispatch(fetchPosts({}));
    }
  }, [userId, dispatch, posts.length]);

  const handleShowAddPostModal = () => {
    dispatch(setIsPostFormVisible(!isPostFormVisible));
  };

  return (
    <Container className={styles.root} content="center">
      <div className={styles.root__posts}>
        {loading ? (
          <>
            {Array.from({ length: 1 }, (_, i) => (
              <PostSkeleton key={i} />
            ))}
          </>
        ) : (
          <>{posts && posts.map((post) => <Post key={post.id} post={{ ...post, viewsCount: 999 }} />)}</>
        )}
      </div>

      <button className={styles.add_post_button} onClick={handleShowAddPostModal}>
        <PlusSvg />
      </button>
    </Container>
  );
};

export default Posts;
