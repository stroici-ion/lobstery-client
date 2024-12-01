import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import emoji from 'react-easy-emoji';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { feelings as feelingsList } from '../../../../utils/emojisMap';
import { useAppDispatch } from '../../../../redux';
import { CheckedSvg, SearchSvg } from '../../../../icons';
import styles from './styles.module.scss';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { setFeeling } from '../../../../redux/posts/slice';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import PostUsername from '../../../PostUsername';
import UserImage from '../../../UserImage';
import ScrollArea from '../../../UI/ScrollArea';

export interface IFeelig {
  id: string;
  code: string;
  name: string;
}

const FeelingTab: React.FC = () => {
  const userProfile = useSelector(selectUserProfile);
  const { feeling, taggedFriends } = useSelector(selectActivePost);
  const [searchText, setSearchText] = useState('');
  const [feelings, setFeelings] = useState<IFeelig[]>(feelingsList);
  const dispatch = useAppDispatch();

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), []);

  const handleSelectFeeling = (feeling: IFeelig) => {
    dispatch(setFeeling(feeling.name));
  };

  const handleRemoveFeeling = () => {
    dispatch(setFeeling(undefined));
  };

  useEffect(() => {
    setFeelings(feelingsList.filter((item) => item.name.includes(searchText)));
  }, [searchText]);

  return (
    <div className={styles.root}>
      <p className={styles.root__title}>How are you feeling?</p>
      <div className={classNames(styles.root__top, styles.user)}>
        <UserImage user={userProfile.user} className={styles.user__avatar} />
        <div className={styles.user__info}>
          <PostUsername user={userProfile.user} feeling={feeling} taggedFriends={taggedFriends} />
        </div>
      </div>
      <div className={styles.root__search}>
        <SearchSvg />
        <input placeholder="Search feeling" className={styles.root__input} onChange={debouncedChangeHandler} />
      </div>
      <div className={classNames(styles.root__selectedPeoples, styles.selectedFeeling, feeling && styles.active)}>
        <div className={styles.selectedFeeling__scrollArea}>
          <button className={styles.selectedFeeling__button} onClick={() => handleRemoveFeeling()}>
            <span className={styles.selectedFeeling__feeling}>
              {feeling &&
                emoji(String.fromCodePoint(parseInt(feelings.find((item) => item.name === feeling)?.code || '', 16)))}
            </span>
            <div className={styles.selectedFeeling__decoration}>
              <CheckedSvg />
            </div>
            <div className={styles.selectedFeeling__decorationRemove}>🗙</div>
          </button>
        </div>
      </div>
      <div className={styles.root__emojis}>
        <ScrollArea>
          <div className={styles.root__emojisBody}>
            {feelings.map((feeling) => (
              <button onClick={() => handleSelectFeeling(feeling)} className={styles.root__button} key={feeling.id}>
                <span>{emoji(String.fromCodePoint(parseInt(feeling.code, 16)))}</span>
                {feeling.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default FeelingTab;
