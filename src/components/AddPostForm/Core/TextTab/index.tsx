import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../redux';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import TextareaAutosize from 'react-textarea-autosize';

import styles from './styles.module.scss';
import WriteText from '../../../WriteText';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { setText, setTitle } from '../../../../redux/posts/slice';

interface ITextTab {}

const TextTab: React.FC<ITextTab> = () => {
  const userProfile = useSelector(selectUserProfile);

  const { title, text, feeling, taggedFriends } = useSelector(selectActivePost);
  const dispatch = useAppDispatch();

  const handleChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setTitle(e.target.value));
  };

  const handleChangeText = (value: string) => {
    dispatch(setText(value));
  };

  return (
    <div className={styles.root}>
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
            placeholder={`What's on your mind ${userProfile.user.firstName}?`}
          />
        </div>
      </div>
    </div>
  );
};

export default TextTab;
