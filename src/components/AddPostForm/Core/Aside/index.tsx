import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  CheckedSvg,
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
import { BsEmojiSmile } from 'react-icons/bs';

import styles from './styles.module.scss';
import emoji from 'react-easy-emoji';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { feelings } from '../../../../utils/emojisMap';
import { selectImages } from '../../../../redux/images/selectors';
import btnStyles from '../../../../styles/components/buttons/buttons.module.scss';
import { selectUserProfile } from '../../../../redux/profile/selectors';

interface IAside {
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const Aside: React.FC<IAside> = ({ selectedTab, setSelectedTab }) => {
  const newPost = useSelector(selectActivePost);
  const images = useSelector(selectImages);
  const userProfile = useSelector(selectUserProfile);
  const selectedAudience = newPost.audience !== -1 ? newPost.audience : userProfile.defaultAudience;

  const handleSelectTab = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  const getAudienceClassname = useMemo(() => {
    switch (selectedAudience) {
      case -1:
      case 1:
        return btnStyles.green;
      case 0:
        return btnStyles.red;
      case 2:
        return btnStyles.blue;
      case 3:
        return btnStyles.blue;
      case 4:
        return btnStyles.yellow;
    }
  }, [selectedAudience]);

  return (
    <div className={classNames(styles.root, selectedTab < 0 && styles.active)}>
      <button
        onClick={() => handleSelectTab(0)}
        className={classNames(styles.root__button, btnStyles.red, selectedTab === 0 && btnStyles.active, styles.text)}
      >
        <TextSvg />
      </button>
      <button
        onClick={() => handleSelectTab(1)}
        className={classNames(styles.root__button, selectedTab === 1 && btnStyles.active, getAudienceClassname)}
      >
        <div className={styles.root__decoration}>
          <GlobeSvg />
        </div>
        {selectedAudience === -1 && <GlobeSvg />}
        {selectedAudience === 1 && <GlobeSvg />}
        {selectedAudience === 0 && <LockSvg />}
        {selectedAudience === 2 && <FriendsSvg />}
        {selectedAudience === 3 && <KnownsSvg />}
        {selectedAudience === 4 && <CustomSettingsSvg />}
      </button>
      <button
        onClick={() => handleSelectTab(2)}
        className={classNames(
          styles.root__button,
          btnStyles.green,
          selectedTab === 2 && btnStyles.active,
          images.length && styles.used,
          styles.image
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
        className={classNames(styles.root__button, btnStyles.red, selectedTab === 3 && btnStyles.active, styles.tag)}
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
        className={classNames(
          styles.root__button,
          btnStyles.yellow,
          selectedTab === 4 && btnStyles.active,
          styles.feeling
        )}
      >
        {newPost.feeling ? (
          emoji(String.fromCodePoint(parseInt(feelings.find((item) => item.name === newPost.feeling)?.code || '', 16)))
        ) : (
          <BsEmojiSmile />
        )}
      </button>
      <button
        onClick={() => handleSelectTab(5)}
        className={classNames(
          styles.root__button,
          btnStyles.blue,
          selectedTab === 5 && btnStyles.active,
          styles.taggedUser
        )}
      >
        {newPost.taggedFriends.length > 0 && (
          <div className={classNames(styles.root__decoration, styles.dott)}>
            <span>•</span>
          </div>
        )}
        <TagPeopleSvg />
      </button>
      <button
        onClick={() => handleSelectTab(-2)}
        className={classNames(
          styles.root__button,
          styles.done,
          btnStyles.green,
          selectedTab === -2 && btnStyles.active
        )}
      >
        <CheckedSvg />
      </button>
      <button
        onClick={() => handleSelectTab(-1)}
        className={classNames(
          styles.root__button,
          styles.checked,
          btnStyles.green,
          selectedTab === -1 && btnStyles.active
        )}
      >
        <CheckedSvg />
      </button>
    </div>
  );
};

export default Aside;
