import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import {
  CheckedSvg,
  EmojiSvg,
  FriendsSvg,
  GlobeSvg,
  ImagesVideoSvg,
  KnownsSvg,
  LockSvg,
  CustomSettingsSvg,
  TagPeopleSvg,
  TagSvg,
  TextSvg,
} from '../../../../icons';

import styles from './styles.module.scss';
import emoji from 'react-easy-emoji';
import { selectDefaultAudience } from '../../../../redux/defaultAudience/selectors';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { feelings } from '../../../../utils/emojisMap';
import { selectImages } from '../../../../redux/images/selectors';

interface IAside {
  selectedTab: number;
  setSelectedtab: React.Dispatch<React.SetStateAction<number>>;
}

const Aside: React.FC<IAside> = ({ selectedTab, setSelectedtab }) => {
  const newPost = useSelector(selectActivePost);
  const images = useSelector(selectImages);
  const defaultAudience = useSelector(selectDefaultAudience);
  const selectedAudience = newPost.audience !== -1 ? newPost.audience : defaultAudience.default_audience;

  const handleSelectTab = (tabIndex: number) => {
    setSelectedtab(tabIndex);
  };

  return (
    <div className={classNames(styles.root, selectedTab < 0 && styles.active)}>
      <button
        onClick={() => handleSelectTab(0)}
        className={classNames(styles.root__button, styles.text, selectedTab === 0 && styles.active)}
      >
        <TextSvg />
      </button>
      <button
        onClick={() => handleSelectTab(1)}
        className={classNames(
          styles.root__button,
          styles.audience,
          selectedAudience === 0 && styles.private,
          selectedAudience === 1 && styles.public,
          selectedAudience === 2 && styles.friends,
          selectedAudience === 3 && styles.friendsOfFriends,
          selectedAudience === 4 && styles.custom,
          selectedTab === 1 && styles.active
        )}
      >
        <div className={styles.root__decoration}>
          <GlobeSvg />
        </div>
        {selectedAudience === 0 && <LockSvg />}
        {selectedAudience === 1 && <GlobeSvg />}
        {selectedAudience === 2 && <FriendsSvg />}
        {selectedAudience === 3 && <KnownsSvg />}
        {selectedAudience === 4 && <CustomSettingsSvg />}
        {/* 0-private, 1-public, 2-friends, 3-friends and friends of friends, 4-custom */}
      </button>
      <button
        onClick={() => handleSelectTab(2)}
        className={classNames(
          styles.root__button,
          styles.image,
          images.length && styles.used,
          selectedTab === 2 && styles.active
        )}
      >
        {images.length > 0 && (
          <div className={classNames(styles.root__decoration, styles.dott)}>
            <span>•</span>
          </div>
        )}
        <ImagesVideoSvg />
      </button>
      <button
        onClick={() => handleSelectTab(3)}
        className={classNames(styles.root__button, styles.tag, selectedTab === 3 && styles.active)}
      >
        {newPost.tags.length > 0 && (
          <div className={classNames(styles.root__decoration, styles.dott)}>
            <span>•</span>
          </div>
        )}
        <TagSvg />
      </button>
      <button
        onClick={() => handleSelectTab(4)}
        className={classNames(styles.root__button, styles.feeling, selectedTab === 4 && styles.active)}
      >
        {newPost.feeling ? (
          emoji(String.fromCodePoint(parseInt(feelings.find((item) => item.name === newPost.feeling)?.code || '', 16)))
        ) : (
          <EmojiSvg />
        )}
      </button>
      <button
        onClick={() => handleSelectTab(5)}
        className={classNames(styles.root__button, styles.tag_people, selectedTab === 5 && styles.active)}
      >
        {newPost.tagged_friends.length > 0 && (
          <div className={classNames(styles.root__decoration, styles.dott)}>
            <span>•</span>
          </div>
        )}
        <TagPeopleSvg />
      </button>
      <button
        onClick={() => handleSelectTab(-2)}
        className={classNames(styles.root__button, styles.checked, selectedTab === -2 && styles.active)}
      >
        <CheckedSvg />
      </button>
      {/* <button
        onClick={() => handleSelectTab(-1)}
        className={classNames(styles.root__button, styles.checked, selectedTab === -1 && styles.active)}
      >
        <CheckedSvg />
      </button> */}
    </div>
  );
};

export default Aside;
