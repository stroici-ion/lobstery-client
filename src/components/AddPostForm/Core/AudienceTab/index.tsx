import React, { useEffect } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { FriendsSvg, GlobeSvg, KnownsSvg, LockSvg, CustomSettingsSvg } from '../../../../icons';
import { useAppDispatch } from '../../../../redux';
import { useSelector } from 'react-redux';
import CustomAudienceForm from '../../../CustomAudienceForm';
import { selectDefaultAudience } from '../../../../redux/defaultAudience/selectors';
import { fetchDefaultAudience } from '../../../../redux/defaultAudience/asyncActions';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { setAudience } from '../../../../redux/posts/slice';

const AudienceTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { audience } = useSelector(selectActivePost);
  const defaultAudience = useSelector(selectDefaultAudience);
  const userId = useSelector(selectUserProfile).id;

  useEffect(() => {
    if (audience < 0)
      if (defaultAudience.defaultAudience) {
        dispatch(setAudience(defaultAudience.defaultAudience));
      }
  }, []);

  const handleChangeAudience = (audience: number) => {
    dispatch(setAudience(audience));
  };

  const handleDefaultAudienceClick = () => {
    dispatch(fetchDefaultAudience({ userId, defaultAudience: audience }));
  };

  return (
    <div className={styles.root}>
      <p className={styles.root__title}>Set target audience!</p>
      <div className={styles.root__list}>
        <button
          className={classNames(styles.root__button, styles.public, audience === 1 && styles.active)}
          onClick={() => handleChangeAudience(1)}
        >
          <GlobeSvg />
          Public
        </button>
        <button
          className={classNames(styles.root__button, styles.private, audience === 0 && styles.active)}
          onClick={() => handleChangeAudience(0)}
        >
          <LockSvg />
          Private
        </button>
        <button
          className={classNames(styles.root__button, styles.custom, audience === 4 && styles.active)}
          onClick={() => handleChangeAudience(4)}
        >
          <CustomSettingsSvg />
          Custom
        </button>
        <button
          className={classNames(styles.root__button, styles.friends, audience === 2 && styles.active)}
          onClick={() => handleChangeAudience(2)}
        >
          <FriendsSvg />
          Friends
        </button>
        <button
          className={classNames(styles.root__button, styles.friendsOfFriends, audience === 3 && styles.active)}
          onClick={() => handleChangeAudience(3)}
        >
          <KnownsSvg />
          Friends and friends of friends
        </button>
      </div>
      <div className={classNames(styles.root__decoration, audience !== 4 && styles.visible)}>
        {audience === 0 && <LockSvg />}
        {audience === 1 && <GlobeSvg />}
        {audience === 2 && <FriendsSvg />}
        {audience === 3 && <KnownsSvg />}
      </div>
      <div className={classNames(styles.root__customAudienceBlock, audience === 4 && styles.visible)}>
        <CustomAudienceForm />
      </div>
      <div
        className={classNames(styles.defaultAudience, defaultAudience.defaultAudience === audience && styles.active)}
        onClick={handleDefaultAudienceClick}
      >
        <span className={styles.defaultAudience__label}>
          {defaultAudience.defaultAudience !== audience ? 'Make default' : 'Default'}
        </span>
      </div>
    </div>
  );
};

export default AudienceTab;
