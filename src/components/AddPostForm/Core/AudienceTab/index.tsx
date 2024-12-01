import React, { useEffect } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { FriendsSvg, GlobeSvg, KnownsSvg, LockSvg, CustomSettingsSvg } from '../../../../icons';
import { useAppDispatch } from '../../../../redux';
import { useSelector } from 'react-redux';
import CustomAudienceForm from '../../../CustomAudienceForm';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { setAudience } from '../../../../redux/posts/slice';
import btnStyles from '../../../../styles/components/buttons/buttons.module.scss';
import { fetchDefaultAudience } from '../../../../redux/profile/audienceAsyncActions';

const AudienceTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { audience, customAudience } = useSelector(selectActivePost);
  const userProfile = useSelector(selectUserProfile);

  const handleChangeAudience = (audience: number) => {
    dispatch(
      setAudience({ audience, customAudience: customAudience ? customAudience : userProfile.defaultCustomAudience })
    );
  };

  const handleDefaultAudienceClick = () => {
    dispatch(fetchDefaultAudience({ userId: userProfile.user.id, defaultAudience: audience }));
  };

  return (
    <div className={styles.root}>
      <p className={styles.root__title}>Set target audience!</p>
      <div className={styles.root__list}>
        <button
          className={classNames(styles.root__button, btnStyles.greenUnderline, audience === 1 && btnStyles.active)}
          onClick={() => handleChangeAudience(1)}
        >
          <GlobeSvg />
          Public
        </button>
        <button
          className={classNames(styles.root__button, btnStyles.redUnderline, audience === 0 && btnStyles.active)}
          onClick={() => handleChangeAudience(0)}
        >
          <LockSvg />
          Private
        </button>
        <button
          className={classNames(styles.root__button, btnStyles.yellowUnderline, audience === 4 && btnStyles.active)}
          onClick={() => handleChangeAudience(4)}
        >
          <CustomSettingsSvg />
          Custom
        </button>
        <button
          className={classNames(styles.root__button, btnStyles.blueUnderline, audience === 2 && btnStyles.active)}
          onClick={() => handleChangeAudience(2)}
        >
          <FriendsSvg />
          Friends
        </button>
        <button
          className={classNames(styles.root__button, btnStyles.blueUnderline, audience === 3 && btnStyles.active)}
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
        className={classNames(styles.defaultAudience, userProfile.defaultAudience === audience && styles.active)}
        onClick={handleDefaultAudienceClick}
      >
        <span className={styles.defaultAudience__label}>
          {userProfile.defaultAudience !== audience ? 'Make default' : 'Default'}
        </span>
      </div>
    </div>
  );
};

export default AudienceTab;
