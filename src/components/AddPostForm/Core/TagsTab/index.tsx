import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckedSvg, ResetSvg, SearchSvg } from '../../../../icons';
import { useAppDispatch } from '../../../../redux';

import styles from './styles.module.scss';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { setTags } from '../../../../redux/posts/slice';

const TagsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tags } = useSelector(selectActivePost);
  const [tagValue, setTagValue] = useState<string>('');

  const handleAddTag = () => {
    if (!tags.includes(tagValue) && tagValue !== '') {
      dispatch(setTags([tagValue, ...tags]));
      setTagValue('');
      return;
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    dispatch(setTags(tags.filter((tag) => tag !== tagToRemove)));
  };

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[a-z]*$/) || e.target.value[e.target.value.length - 1].match(/^\c$/))
      setTagValue(e.target.value.toLocaleLowerCase());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
      e.preventDefault();
    }
  };

  const handleResetTags = () => {
    dispatch(setTags([]));
  };

  return (
    <div className={styles.root}>
      <p className={styles.root__title}>Add tags!</p>
      <div className={styles.root__search}>
        <SearchSvg />
        <input
          className={styles.root__input}
          placeholder="Search feeling"
          onKeyDown={handleInputKeyDown}
          onChange={handleInputOnChange}
          value={tagValue}
        />
        <button onClick={handleAddTag} className={styles.root__add}>
          Add tag
        </button>
      </div>
      <div className={styles.root__tags}>
        <div className={styles.root__scrollArea}>
          {tags.length ? (
            tags.map((tag) => (
              <button key={tag} className={styles.root__tag} onClick={() => handleRemoveTag(tag)}>
                {tag}
                <div className={styles.root__decoration}>
                  <CheckedSvg />
                </div>
                <div className={styles.root__decorationRemove}>🗙</div>
              </button>
            ))
          ) : (
            <p className={styles.root__empty}>No tags...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagsTab;
