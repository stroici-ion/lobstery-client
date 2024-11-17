import classNames from 'classnames';
import React from 'react';
import { CheckedSvg } from '../../icons';
import { IUser } from '../../redux/profile/types';

import styles from './styles.module.scss';
import UserImage from '../UserImage';

interface ISelectedUsers {
  users?: IUser[];
  onRemove?: (user: IUser) => void;
  className?: string;
}

const SelectedUsers: React.FC<ISelectedUsers> = ({ users = [], onRemove, className }) => {
  const handleRemoveUser = (user: IUser) => {
    onRemove?.(user);
  };

  return (
    <div className={classNames(className, styles.selectedPeoples, users.length && styles.active)}>
      <div className={styles.selectedPeoples__scrollArea}>
        {users.map((user) => (
          <button className={styles.selectedPeoples__button} key={user.id} onClick={() => handleRemoveUser(user)}>
            <UserImage user={user} />
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
