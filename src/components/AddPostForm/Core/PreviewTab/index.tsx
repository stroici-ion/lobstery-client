import { useSelector } from 'react-redux';
import React from 'react';

import { selectUserProfile } from '../../../../redux/profile/selectors';
import { useAppDispatch } from '../../../../redux';
import styles from './styles.module.scss';
import Post from '../../../Post';
import classNames from 'classnames';
import { fetchCreatePost } from '../../../../redux/posts/asyncActions';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { selectImages } from '../../../../redux/images/selectors';
import ScrollArea from '../../../UI/ScrollArea';
import { selectAuthStatus } from '../../../../redux/auth/selectors';

interface IPreviewTab {
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const PreviewTab: React.FC<IPreviewTab> = ({ setSelectedTab }) => {
  const userProfile = useSelector(selectUserProfile);
  const newPost = useSelector(selectActivePost);
  const images = useSelector(selectImages);
  const dispatch = useAppDispatch();
  const { userId } = useSelector(selectAuthStatus);

  const onSubmit = async () => {
    if (userId) {
      setSelectedTab(-1);
      dispatch(fetchCreatePost({ post: newPost, images }));
    }
  };

  return (
    <div className={styles.root}>
      <p className={styles.root__title}>This is what the post will look like!</p>
      <ScrollArea className={styles.root__scrollArea}>
        <Post
          className={styles.root__postPreview}
          post={{
            id: 0,
            title: newPost.title || '',
            text: newPost.text || '',
            imageSet: images,
            tags: newPost.tags,
            feeling: newPost.feeling || '',
            imagesLayout: newPost.imagesLayout,
            viewsCount: 0,
            commentsCount: 0,
            user: userProfile.user,
            taggedFriends: newPost.taggedFriends,
            createdAt: new Date(),
            updatedAt: new Date(),
            liked: false,
            disliked: false,
            likesCount: 0,
            dislikesCount: 0,
            audience: newPost.audience,
            customAudience: newPost.customAudience,
            favorite: false,
          }}
        />
      </ScrollArea>
      <button onClick={onSubmit} className={classNames(styles.root__submit, styles.update)}>
        {false ? 'Save modifications' : 'Create Post'}
      </button>
    </div>
  );
};

export default PreviewTab;
