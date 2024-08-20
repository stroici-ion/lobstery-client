import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../redux';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import PostUsername from '../../../PostUsername';
import TextareaAutosize from 'react-textarea-autosize';

import styles from './styles.module.scss';
import WriteText from '../../../WriteText';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { setText, setTitle } from '../../../../redux/posts/slice';

interface ITextTab {}

const TextTab: React.FC<ITextTab> = () => {
  const user = useSelector(selectUserProfile);

  const { title, text, feeling, tagged_friends } = useSelector(selectActivePost);
  const dispatch = useAppDispatch();

  const handleChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setTitle(e.target.value));
  };

  const handleChangeText = (value: string) => {
    dispatch(setText(value));
  };

  return (
    <div className={styles.root}>
      <div className={classNames(styles.root__top, styles.user)}>
        <img className={styles.user__avatar} src={user.profile.avatar_thumbnail} alt="Avatar" />
        <div className={styles.user__info}>
          <PostUsername user={user} feeling={feeling} taggedFriends={tagged_friends} />
        </div>
      </div>
      <div className={styles.root__body}>
        <div className={classNames(styles.root__text, styles.text)}>
          <TextareaAutosize
            value={title}
            onChange={handleChangeTitle}
            className={styles.text__title}
            placeholder="Title"
          />
          <WriteText
            className={styles.text__description}
            value={text}
            setValue={handleChangeText}
            placeholder={`What's on your mind ${user.first_name}?`}
          />
        </div>
      </div>
    </div>
  );
};

export default TextTab;
