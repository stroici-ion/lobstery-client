import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { v4 } from 'uuid';

import { selectUserProfile } from '../../../../redux/profile/selectors';
import { selectUserId } from '../../../../redux/auth/selectors';
import { useAppDispatch } from '../../../../redux';
import styles from './styles.module.scss';
import $api from '../../../../http';
import Post from '../../../Post';
import classNames from 'classnames';
import { IImage } from '../../../../models/IImage';
import { fetchCreatePost } from '../../../../redux/posts/asyncActions';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { selectImages } from '../../../../redux/images/selectors';
import ScrollArea from '../../../UI/ScrollArea';

interface IPreviewTab {
  setSelectedtab: React.Dispatch<React.SetStateAction<number>>;
}

const PreviewTab: React.FC<IPreviewTab> = ({ setSelectedtab }) => {
  const user = useSelector(selectUserProfile);
  const newPost = useSelector(selectActivePost);
  const images = useSelector(selectImages);
  const userId = useSelector(selectUserId);
  const dispatch = useAppDispatch();

  const onSubmit = async () => {
    if (userId) {
      setSelectedtab(-1);
      dispatch(fetchCreatePost({ post: newPost, images }));
    }
  };

  return (
    <div className={styles.root}>
      <p className={styles.root__title}>Result!</p>
      <ScrollArea className={styles.root__scrollArea}>
        <Post
          className={styles.root__postPreview}
          post={{
            id: 0,
            title: newPost.title || '',
            text: newPost.text || '',
            image_set: images,
            tags: newPost.tags,
            feeling: newPost.feeling || '',
            viewsCount: 0,
            comments_count: 0,
            user: user,
            tagged_friends: newPost.tagged_friends,
            created_at: new Date(),
            updated_at: new Date(),
            liked: false,
            disliked: false,
            likes_count: 0,
            dislikes_count: 0,
            audience: newPost.audience,
            custom_audience: newPost.custom_audience,
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
