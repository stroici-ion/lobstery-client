import React from 'react';

import styles from './styles.module.scss';
import { IAudience } from '../../../../models/audience/IAudience';
import classNames from 'classnames';
import { FriendsSvg, GlobeSvg, KnownsSvg, LockSvg } from '../../../../icons';

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
          audience.audience === 0 && styles.customAudience__private,
          audience.audience === 1 && styles.customAudience__public,
          audience.audience === 2 && styles.customAudience__friends,
          audience.audience === 3 && styles.customAudience__friendsOfFriends
        )}
      >
        {audience.audience === 0 && <LockSvg />}
        {audience.audience === 1 && <GlobeSvg />}
        {audience.audience === 2 && <FriendsSvg />}
        {audience.audience === 3 && <KnownsSvg />}
        {audience.title}
      </button>
    </div>
  );
};

export default CustomAudienceRow;
