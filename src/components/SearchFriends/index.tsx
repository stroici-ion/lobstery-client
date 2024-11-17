import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

import { SearchSvg } from '../../icons';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../redux/auth/selectors';
import { fetchFriends } from '../../services/users/SearchFriends';
import Loader from '../Loader';
import { IUser } from '../../redux/profile/types';
import SelectedUsers from '../SelectedUsers';
import ScrollArea from '../UI/ScrollArea';
import getUserName from '../user/utils/getUserName';
import UserImage from '../UserImage';

interface ISearchFirends {
  className?: string;
  onSelect: (friend: IUser) => void;
  taggedFriends?: IUser[];
  onRemove?: (friend: IUser) => void;
}

const SearchFirends: React.FC<ISearchFirends> = ({ className, onSelect, taggedFriends, onRemove }) => {
  const userId = useSelector(selectUserId);
  const [friends, setFriends] = useState<IUser[]>([]);

  const [username, setUsername] = useState('');
  const [isFriendsLoading, setIsFriendsLoading] = useState(false);

  const isFriendTagged = (friend: IUser) => {
    if (taggedFriends) {
      return taggedFriends.map((obj) => obj.id).includes(friend.id);
    }
    return false;
  };

  useEffect(() => {
    if (userId) {
      setIsFriendsLoading(true);
      fetchFriends(userId, username).then((firends) => {
        setFriends(firends);
        setIsFriendsLoading(false);
      });
    }
  }, [username]);

  const handleSelectFriend = (friend: IUser) => {
    onSelect(friend);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), []);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.root__search}>
        <SearchSvg />
        <input placeholder="Search friend" className={styles.root__input} onChange={debouncedChangeHandler} />
      </div>
      <div className={styles.root__selectedPeoples}>
        {onRemove && <SelectedUsers users={taggedFriends} onRemove={onRemove} />}
      </div>
      <div className={classNames(styles.root__users, styles.users)}>
        <ScrollArea>
          {isFriendsLoading ? (
            <Loader height={80} size={70} />
          ) : friends.length ? (
            friends.map(
              (friend) =>
                !isFriendTagged(friend) && (
                  <button className={styles.users__button} key={friend.id} onClick={() => handleSelectFriend(friend)}>
                    <UserImage user={friend} className={styles.users__avatar} />
                    {getUserName(friend)}
                  </button>
                )
            )
          ) : (
            <div className={styles.users__empty}>Not found</div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default SearchFirends;
