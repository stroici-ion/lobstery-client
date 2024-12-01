import React from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { BlackListSvg, FriendsSvg, KnownsSvg, LockSvg, WhiteListSvg } from '../../../../icons';
import { IAudience } from '../../../../redux/profile/audienceTypes';

interface ICustomAudienceRow {
  audience: IAudience;
  onClick?: () => void;
}

const CustomAudienceRow: React.FC<ICustomAudienceRow> = ({ audience, onClick }) => {
  return (
    <div key={audience.id} className={classNames(styles.root, styles.customAudience)}>
      <div className={styles.customAudience__setDefaultBtn}></div>
      <button
        onClick={onClick}
        className={classNames(
          styles.customAudience__button,
          audience.audience === 0 && styles.customAudience__whiteList,
          audience.audience === 1 && styles.customAudience__blackList,
          audience.audience === 2 && styles.customAudience__friends,
          audience.audience === 3 && styles.customAudience__friendsOfFriends
        )}
      >
        {audience.audience === 0 && <WhiteListSvg />}
        {audience.audience === 1 && <BlackListSvg />}
        {audience.audience === 2 && <FriendsSvg />}
        {audience.audience === 3 && <KnownsSvg />}
        {audience.title}
      </button>
    </div>
  );
};

export default CustomAudienceRow;
