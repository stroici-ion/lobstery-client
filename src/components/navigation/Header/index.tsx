import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import styles from './styles.module.scss';

import { logOut } from '../../../redux/auth/slice';
import { useAppDispatch } from '../../../redux';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../redux/profile/selectors';
import { selectAuthStatus } from '../../../redux/auth/selectors';
import { EFetchStatus } from '../../../types/enums';
import { LOGIN_ROUTE } from '../../../utils/consts';
import { BellSvg, DarkModeSvg, HomeSvg, LogOutSvg, SearchSvg, SettingsSvg } from '../../../icons';
import classNames from 'classnames';
import RippleButton from '../../UI/buttons/RippleButton';
import { BrightnessSvg } from '../../../icons/imageEditor';
import UserImage from '../../UserImage';
import getUserName from '../../user/utils/getUserName';
import { useContextMenu } from '../../../hooks/useContextMenu';
import ContextMenu from '../../UI/ContextMenu';
import ctxBtnStyles from '../../../styles/components/buttons/contextButtons.module.scss';
import FeedbackSvg from '../../../icons/FeedbackSvg';
import { selectIsPrimaryMenuCollapsed } from '../../../redux/app/selectors';
import Container from '../../../layouts/Container';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme'));
  const userProfile = useSelector(selectUserProfile);

  const { userId } = useSelector(selectAuthStatus);

  const handleLogout = () => {
    if (userId) dispatch(logOut());
    navigate(LOGIN_ROUTE);
  };

  const userContex = useContextMenu();

  return (
    <Container className={styles.header}>
      <div className={styles.header__body}>
        <div className={styles.header__searchbar}>
          <SearchSvg />
          <input type="search" />
        </div>
        <div className={styles.header__tools}>
          <RippleButton
            className={classNames(styles.header__button, styles.themeButton)}
            onClick={(e) => {
              const theme = document.documentElement.getAttribute('data-theme');
              if (theme) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                setTheme('light');
              } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                setTheme('dark');
              }
            }}
          >
            {theme === 'dark' ? <DarkModeSvg /> : <BrightnessSvg />}
            {theme === 'dark' ? 'Dark' : 'Light'}
          </RippleButton>
          <RippleButton className={classNames(styles.header__button, styles.notificationsButton, styles.active)}>
            <BellSvg />
            <label />
          </RippleButton>
        </div>
        {userProfile.user && (
          <>
            <RippleButton
              triggerRef={userContex.triggerRef}
              className={classNames(styles.header__button, styles.user__button)}
              onClick={userContex.onShow}
            >
              <div className={classNames(styles.header__user)}>
                <UserImage user={userProfile.user} />
                <span className={styles.header__userName}>{getUserName(userProfile.user)}</span>
              </div>
            </RippleButton>
            {userContex.isOpen && (
              <ContextMenu {...userContex}>
                <div className={styles.user__context}>
                  <button className={styles.user__top}>
                    <UserImage user={userProfile.user} />
                    {getUserName(userProfile.user)}
                  </button>
                  <div className={styles.user__buttons}>
                    <button className={classNames(styles.user__ctxButton, ctxBtnStyles.panel1Blue)} onClick={() => {}}>
                      <HomeSvg />
                      Profile
                    </button>
                    <button
                      className={classNames(styles.user__ctxButton, ctxBtnStyles.panel1Orange)}
                      onClick={() => {}}
                    >
                      <SettingsSvg />
                      Settings & Privacy
                    </button>
                    <button className={classNames(styles.user__ctxButton, ctxBtnStyles.panel1Green)} onClick={() => {}}>
                      <FeedbackSvg />
                      Give feedback
                    </button>
                    <button
                      className={classNames(styles.user__ctxButton, ctxBtnStyles.panel1Red)}
                      onClick={handleLogout}
                    >
                      <LogOutSvg />
                      Log out
                    </button>
                  </div>
                </div>
              </ContextMenu>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default Header;
