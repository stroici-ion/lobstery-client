import React, { ChangeEvent, useEffect, useRef } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { IUser } from '../../../../redux/profile/types';
import { ArrowDownSvg, BlackListSvg, FriendsSvg, KnownsSvg, WhiteListSvg } from '../../../../icons';
import SearchFirends from '../../../SearchFriends';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../redux';

import { EFetchStatus } from '../../../../types/enums';
import ctxBtnStyles from '../../../../styles/components/buttons/contextButtons.module.scss';
import btnStyles from '../../../../styles/components/buttons/solidLightButtons.module.scss';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import ContextMenu from '../../../UI/ContextMenu';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import {
  addActiveCustomAudienceFriend,
  removeActiveCustomAudienceFriend,
  setActiveCustomAudienceTitle,
  setActiveCustomAudienceType,
} from '../../../../redux/profile/slice';
import { fetchCustomAudience } from '../../../../redux/profile/audienceAsyncActions';

interface IEditCustomAudience {
  goBack: () => void;
}

const EditCustomAudience: React.FC<IEditCustomAudience> = ({ goBack }) => {
  const userProfile = useSelector(selectUserProfile);
  const customAudienceType = userProfile.activeCustomAudience.audience;
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
          customAudience: userProfile.activeCustomAudience,
          update: userProfile.activeCustomAudience.id > 0,
        })
      );
    }
  };

  useEffect(() => {
    if (userProfile.customAudienceStatus === EFetchStatus.SUCCESS && isUpdated.current) {
      goBack();
    }
  }, [userProfile.customAudienceStatus]);

  const ctx = useContextMenu();

  return (
    <div className={styles.root}>
      <div className={styles.root__header}>
        <input
          className={styles.root__input}
          value={userProfile.activeCustomAudience?.title}
          onChange={handleTitleOnChange}
          placeholder="Custom audience title"
        />
        <button
          className={classNames(styles.createNew, btnStyles.greenDarkSolid)}
          onClick={handleCreateCustomAudienceClick}
        >
          {userProfile.activeCustomAudience.id >= 0 ? 'Save' : 'Create'}
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
        <button
          ref={ctx.triggerRef}
          onClick={ctx.onShow}
          className={classNames(
            styles.root__audienceBtn,
            customAudienceType === 0 && ctxBtnStyles.panel1Green,
            customAudienceType === 1 && ctxBtnStyles.panel1Red,
            customAudienceType === 2 && ctxBtnStyles.panel1Blue,
            customAudienceType === 3 && ctxBtnStyles.panel1Blue
          )}
        >
          {customAudienceType === 0 && <WhiteListSvg />}
          {customAudienceType === 1 && <BlackListSvg />}
          {customAudienceType === 2 && <FriendsSvg />}
          {customAudienceType === 3 && <KnownsSvg />}
          <ArrowDownSvg />
        </button>
        {ctx.isOpen && (
          <ContextMenu {...ctx}>
            <button
              className={classNames(styles.submenu__button, ctxBtnStyles.panel1Green)}
              onClick={() => handleSetCustomAudienceType(0)}
            >
              <WhiteListSvg />
              Whitelist
            </button>
            <button
              className={classNames(styles.submenu__button, ctxBtnStyles.panel1Red)}
              onClick={() => handleSetCustomAudienceType(1)}
            >
              <BlackListSvg />
              Blacklist
            </button>
            <button
              className={classNames(styles.submenu__button, ctxBtnStyles.panel1Blue)}
              onClick={() => handleSetCustomAudienceType(2)}
            >
              <FriendsSvg />
              Friends Blacklist
            </button>
            <button
              className={classNames(styles.submenu__button, ctxBtnStyles.panel1Blue)}
              onClick={() => handleSetCustomAudienceType(3)}
            >
              <KnownsSvg />
              Knowns Blacklist
            </button>
          </ContextMenu>
        )}
      </div>
      <SearchFirends
        taggedFriends={userProfile.activeCustomAudience.users}
        onRemove={handleOnRemoveFriend}
        onSelect={handleOnSelectFriend}
      />
    </div>
  );
};

export default EditCustomAudience;
