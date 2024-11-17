import React from 'react';

import { useAppDispatch } from '../../../../redux';
import SearchFirends from '../../../SearchFriends';
import { IUser } from '../../../../redux/profile/types';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { addTaggedFriend, removeTaggedFriend } from '../../../../redux/posts/slice';

const TagFriendsTab: React.FC = () => {
  const { taggedFriends } = useSelector(selectActivePost);

  const dispatch = useAppDispatch();
  const handleSelectFriend = (friend: IUser) => {
    dispatch(addTaggedFriend(friend));
  };

  const handleRemoveFriend = (friend: IUser) => {
    dispatch(removeTaggedFriend(friend.id));
  };

  return (
    <div className={styles.root}>
      <p className={styles.root__title}>Mention friends!</p>
      <SearchFirends onSelect={handleSelectFriend} taggedFriends={taggedFriends} onRemove={handleRemoveFriend} />
    </div>
  );
};

export default TagFriendsTab;
