import React from 'react';
import emoji from 'react-easy-emoji';
import { IUser } from '../../redux/profile/types';
import { feelings } from '../../utils/emojisMap';

import styles from './styles.module.scss';
import getUserName from '../user/utils/getUserName';

interface IPostUsername {
  user: IUser;
  feeling?: string;
  taggedFriends: IUser[];
}

const PostUsername: React.FC<IPostUsername> = ({ user, feeling, taggedFriends }) => {
  const selectedFeeling = feelings.find((item) => item.name === feeling);
  const isFriendsTagged = taggedFriends?.length > 0;

  return (
    <p className={styles.root__name}>
      {getUserName(user)}
      {selectedFeeling && (
        <>
          <span className={styles.root__feeling}>
            {emoji(
              String.fromCodePoint(
                parseInt(feelings.find((item) => item.name === selectedFeeling.name)?.code || '', 16)
              )
            )}
          </span>
          <span>
            is feeling {selectedFeeling.name}
            {!taggedFriends.length && '.'}
          </span>
        </>
      )}

      {isFriendsTagged && (
        <>
          <span>{!selectedFeeling && 'is'} with </span>
          {taggedFriends.map((friend, index) => (
            <React.Fragment key={friend.id}>
              {index > 0 && index < taggedFriends.length - 1 && <span className={styles.noMarginLeft}>, </span>}
              {index === taggedFriends.length - 1 && taggedFriends.length > 1 && <span>and</span>}
              {`${friend.firstName}${friend.lastName ? ' ' + friend.lastName : ''}${
                index === taggedFriends.length - 1 ? '.' : ''
              }`}
            </React.Fragment>
          ))}
        </>
      )}
    </p>
  );
};

export default PostUsername;
