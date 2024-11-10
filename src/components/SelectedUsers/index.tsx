import classNames from 'classnames';
import React from 'react';
import { CheckedSvg } from '../../icons';
import { IUser } from '../../models/IUser';

import styles from './styles.module.scss';

interface ISelectedUsers {
  className?: string;
  taggedFriends?: IUser[];
  onRemove?: (friend: IUser) => void;
}

const SelectedUsers: React.FC<ISelectedUsers> = ({ taggedFriends, onRemove, className }) => {
  const handleRemovetFriend = (friend: IUser) => {
    onRemove?.(friend);
  };

  return (
    <div className={classNames(className, styles.selectedPeoples, taggedFriends?.length && styles.active)}>
      <div className={styles.selectedPeoples__scrollArea}>
        {taggedFriends?.map((friend) => (
          <button
            className={styles.selectedPeoples__button}
            key={friend.id}
            onClick={() => handleRemovetFriend(friend)}
          >
            <img className={styles.avatar} src={friend.profile?.avatarThumbnail} alt='' />
            <div className={styles.selectedPeoples__decoration}>
              <CheckedSvg />
            </div>
            <div className={styles.selectedPeoples__decorationRemove}>🗙</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectedUsers;
