import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';
import { IUser } from '../../models/IUser';

interface IUserImage {
  user: IUser;
  className?: string;
}

const UserImage: React.FC<IUserImage> = ({ user, className }) => {
  if (user.profile?.avatar_thumbnail)
    return <img className={classNames(styles.image, className)} src={user.profile.avatar_thumbnail} />;
  return (
    <div className={classNames(styles.acronyms, className)}>{user.first_name[0] || '' + user.last_name[0] || ''}</div>
  );
};

export default UserImage;
