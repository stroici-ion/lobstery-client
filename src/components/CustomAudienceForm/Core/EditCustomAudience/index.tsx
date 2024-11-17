import React, { ChangeEvent, useEffect, useRef } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { IUser } from '../../../../redux/profile/types';
import ContextMenu from '../../../ContextMenu';
import { ArrowDownSvg, FriendsSvg, GlobeSvg, KnownsSvg, LockSvg } from '../../../../icons';
import SearchFirends from '../../../SearchFriends';
import { useSelector } from 'react-redux';
import { selectDefaultAudience } from '../../../../redux/defaultAudience/selectors';
import { useAppDispatch } from '../../../../redux';
import {
  addActiveCustomAudienceFriend,
  removeActiveCustomAudienceFriend,
  setActiveCustomAudienceTitle,
  setActiveCustomAudienceType,
} from '../../../../redux/defaultAudience/slice';
import { fetchCustomAudience } from '../../../../redux/defaultAudience/asyncActions';
import { EFetchStatus } from '../../../../types/enums';

interface IEditCustomAudience {
  goBack: () => void;
}

const EditCustomAudience: React.FC<IEditCustomAudience> = ({ goBack }) => {
  const { activeCustomAudience, customAudienceStatus } = useSelector(selectDefaultAudience);
  const customAudienceType = activeCustomAudience.audience;
  const dispatch = useAppDispatch();
  const isUpdated = useRef<boolean>(false);

  const handleSetCustomAudienceType = (customAudienceType: number) => {
    dispatch(setActiveCustomAudienceType(customAudienceType));
    isUpdated.current = true;
  };

  const handleOnSelectFriend = (friend: IUser) => {
    dispatch(addActiveCustomAudienceFriend(friend));
    isUpdated.current = true;
  };

  const handleOnRemoveFriend = (friend: IUser) => {
    dispatch(removeActiveCustomAudienceFriend(friend.id));
    isUpdated.current = true;
  };

  const handleTitleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setActiveCustomAudienceTitle(e.target.value));
    isUpdated.current = true;
  };

  const handleCreateCustomAudienceClick = () => {
    if (isUpdated.current) {
      dispatch(
        fetchCustomAudience({
          customAudience: activeCustomAudience,
          update: activeCustomAudience.id > 0,
        })
      );
    }
  };

  useEffect(() => {
    if (customAudienceStatus === EFetchStatus.SUCCESS && isUpdated.current) {
      goBack();
    }
  }, [customAudienceStatus]);

  return (
    <div className={styles.root}>
      <div className={styles.root__header}>
        <input
          className={styles.root__input}
          value={activeCustomAudience?.title}
          onChange={handleTitleOnChange}
          placeholder="Custom audience title"
        />
        <button className={styles.createNew} onClick={handleCreateCustomAudienceClick}>
          {activeCustomAudience.id >= 0 ? 'Save' : 'Create'}
        </button>
      </div>
      <div className={classNames(styles.root__top, styles.top)}>
        <p className={styles.top__title}>
          {customAudienceType === 0 && 'Post will be shown only for whitelist members'}
          {customAudienceType === 1 && 'Post will be hidden for blacklist members'}
          {customAudienceType === 2 && 'Post will be shown for friends and hidden for blacklist members'}
          {customAudienceType === 3 &&
            'Post will be shown for friends and friends of friends and hidden for blacklist members'}
        </p>
        <ContextMenu
          className={classNames(styles.root__submenu, styles.submenu)}
          openButton={(onClick: any) => (
            <button
              onClick={onClick}
              className={classNames(
                styles.root__audienceBtn,
                customAudienceType === 0 && styles.private,
                customAudienceType === 1 && styles.public,
                customAudienceType === 2 && styles.friends,
                customAudienceType === 3 && styles.friendsOfFriends
              )}
            >
              {customAudienceType === 0 && <LockSvg />}
              {customAudienceType === 1 && <GlobeSvg />}
              {customAudienceType === 2 && <FriendsSvg />}
              {customAudienceType === 3 && <KnownsSvg />}
              <ArrowDownSvg />
            </button>
          )}
        >
          <button
            className={classNames(styles.submenu__button, styles.private)}
            onClick={() => handleSetCustomAudienceType(0)}
          >
            <LockSvg />
            Whitelist
          </button>
          <button
            className={classNames(styles.submenu__button, styles.public)}
            onClick={() => handleSetCustomAudienceType(1)}
          >
            <GlobeSvg />
            Blacklist
          </button>
          <button
            className={classNames(styles.submenu__button, styles.friends)}
            onClick={() => handleSetCustomAudienceType(2)}
          >
            <FriendsSvg />
            Friends Blacklist
          </button>
          <button
            className={classNames(styles.submenu__button, styles.friendsOfFriends)}
            onClick={() => handleSetCustomAudienceType(3)}
          >
            <KnownsSvg />
            Knowns Blacklist
          </button>
        </ContextMenu>
      </div>
      <SearchFirends
        taggedFriends={activeCustomAudience.users}
        onRemove={handleOnRemoveFriend}
        onSelect={handleOnSelectFriend}
      />
    </div>
  );
};

export default EditCustomAudience;
