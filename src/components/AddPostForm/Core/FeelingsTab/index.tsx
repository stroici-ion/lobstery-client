import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import emoji from 'react-easy-emoji';

import { feelings as feelingsList } from '../../../../utils/emojisMap';
import { useAppDispatch } from '../../../../redux';
import { useSelector } from 'react-redux';
import { CheckedSvg, SearchSvg } from '../../../../icons';
import { IFeelig } from '../../../../models/IFeeling';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { setFeeling } from '../../../../redux/posts/slice';

const FeelingTab: React.FC = () => {
  const { feeling } = useSelector(selectActivePost);
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
      <div className={styles.root__search}>
        <SearchSvg />
        <input
          placeholder="Search feeling"
          className={styles.root__input}
          onChange={debouncedChangeHandler}
        />
      </div>
      <div
        className={classNames(
          styles.root__selectedPeoples,
          styles.selectedFeeling,
          feeling && styles.active
        )}
      >
        <div className={styles.selectedFeeling__scrollArea}>
          <button className={styles.selectedFeeling__button} onClick={() => handleRemoveFeeling()}>
            <span className={styles.selectedFeeling__feeling}>
              {feeling &&
                emoji(
                  String.fromCodePoint(
                    parseInt(feelings.find((item) => item.name === feeling)?.code || '', 16)
                  )
                )}
            </span>
            <div className={styles.selectedFeeling__decoration}>
              <CheckedSvg />
            </div>
            <div className={styles.selectedFeeling__decorationRemove}>🗙</div>
          </button>
        </div>
      </div>
      <div className={styles.root__emojis}>
        <div className={styles.root__scrollArea}>
          {feelings.map((feeling) => (
            <button
              onClick={() => handleSelectFeeling(feeling)}
              className={styles.root__button}
              key={feeling.id}
            >
              <span>{emoji(String.fromCodePoint(parseInt(feeling.code, 16)))}</span>
              {feeling.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeelingTab;
