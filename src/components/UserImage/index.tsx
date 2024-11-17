import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';
import { IUser } from '../../redux/profile/types';
import getUserAcronyms from '../user/utils/getUserAcronyms';

interface IUserImage {
  user: IUser;
  className?: string;
}

const UserImage: React.FC<IUserImage> = ({ user, className }) => {
  if (user.profile?.avatarThumbnail)
    return <img className={classNames(styles.image, className)} src={user.profile.avatarThumbnail} alt="" />;
  return <div className={classNames(styles.acronyms, className)}>{getUserAcronyms(user)}</div>;
};

export default UserImage;
