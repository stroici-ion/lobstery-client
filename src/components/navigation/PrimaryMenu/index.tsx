import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import MenuButton from '../MenuButton';
import styles from './styles.module.scss';

import {
  HomeSvg,
  GallerySvg,
  MessagingSvg,
  SettingsSvg,
  LogoSvg,
  LogOutSvg,
  UserSvg,
  GamesSvg,
  CloseAsidePanelSvg,
  OpenAsidePanelSvg,
} from '../../../icons';
import { GAMES_ROUTE, HOME_ROUTE, LOGIN_ROUTE, POSTS_ROUTE, USER_SETTINGS_ROUTE } from '../../../utils/consts';
import { logOut } from '../../../redux/auth/slice';
import { useAppDispatch } from '../../../redux';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../redux/profile/selectors';
import ContextMenu from '../../ContextMenu';
import classNames from 'classnames';
import { selectAuthStatus } from '../../../redux/auth/selectors';
import UserImage from '../../UserImage';
import { EFetchStatus } from '../../../types/enums';
import useSwipe from '../../../hooks/useSwipe';

const PrimaryMenu: React.FC = () => {
  const [activeButton, setAcitveButton] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const user = useSelector(selectUserProfile);

  const authorizationStatus = useSelector(selectAuthStatus);
  const isAuth = authorizationStatus === EFetchStatus.SUCCESS;

  const handleLogout = () => {
    if (isAuth) dispatch(logOut());
    navigate(LOGIN_ROUTE);
  };

  const handleToggleAsidePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  const userName = `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`;

  const userContextMenu = (
    <>
      <button className={classNames(styles.user__button, styles.profile)} onClick={() => navigate(USER_SETTINGS_ROUTE)}>
        <HomeSvg />
        Profile
      </button>
      <button className={classNames(styles.user__button, styles.logout)} onClick={handleLogout}>
        <LogOutSvg />
        Log out
      </button>
    </>
  );

  return (
    <>
      <div className={classNames(styles.padding, isPanelCollapsed && styles.collapsed)} />
      <aside className={classNames(styles.aside, isPanelCollapsed && styles.collapsed)}>
        <div className={classNames(styles.aside__top, styles.top, isPanelCollapsed && styles.collapsed)}>
          <Link to={HOME_ROUTE} className={styles.top__logo}>
            <div className={styles.top__logoSvg}>
              <LogoSvg />
            </div>
            <div className={styles.top__logoTextSvg}>Lobstery</div>
          </Link>
        </div>
        <div className={classNames(styles.aside__body, styles.body, isPanelCollapsed && styles.collapsed)}>
          <div className={styles.body__collapse}>
            <button className={classNames(styles.body__collapseButton)} onClick={handleToggleAsidePanel}>
              {isPanelCollapsed ? <OpenAsidePanelSvg /> : <CloseAsidePanelSvg />}
            </button>
          </div>
          <div className={styles.body__buttons}>
            <span className={styles.body__buttonsDecoration} style={{ top: 50 * activeButton }} />
            <Link to={HOME_ROUTE}>
              <MenuButton
                collapsed={isPanelCollapsed}
                onClick={() => setAcitveButton(0)}
                active={activeButton === 0}
                icon={HomeSvg}
              >
                Home
              </MenuButton>
            </Link>
            <Link to={POSTS_ROUTE}>
              <MenuButton
                collapsed={isPanelCollapsed}
                onClick={() => setAcitveButton(1)}
                active={activeButton === 1}
                icon={GallerySvg}
              >
                Posts
              </MenuButton>
            </Link>
            <Link to={POSTS_ROUTE}>
              <MenuButton
                collapsed={isPanelCollapsed}
                onClick={() => setAcitveButton(2)}
                active={activeButton === 2}
                icon={MessagingSvg}
              >
                Messaging
              </MenuButton>
            </Link>
            <Link to={GAMES_ROUTE}>
              <MenuButton
                collapsed={isPanelCollapsed}
                onClick={() => setAcitveButton(3)}
                active={activeButton === 3}
                icon={GamesSvg}
              >
                Games
              </MenuButton>
            </Link>
            <Link to={GAMES_ROUTE}>
              <MenuButton
                collapsed={isPanelCollapsed}
                onClick={() => setAcitveButton(4)}
                active={activeButton === 4}
                icon={SettingsSvg}
              >
                Settings
              </MenuButton>
            </Link>
            <MenuButton
              icon={SettingsSvg}
              onClick={() => {
                const theme = document.documentElement.getAttribute('data-theme');
                if (theme) {
                  document.documentElement.removeAttribute('data-theme');
                  localStorage.removeItem('theme');
                } else {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  localStorage.setItem('theme', 'dark');
                }
              }}
            >
              Dark Theme
            </MenuButton>
          </div>
        </div>
        <div className={classNames(styles.aside__bottom, styles.bottom, isPanelCollapsed && styles.collapsed)}>
          {isAuth && user.id ? (
            <div className={classNames(styles.user, isPanelCollapsed && styles.collapsed)}>
              <ContextMenu
                openButton={(onClick: any) => (
                  <button className={styles.user__openMenuButton} onClick={onClick}>
                    <UserImage user={user} className={styles.user__img} />
                  </button>
                )}
              >
                {userContextMenu}
              </ContextMenu>
              <div className={classNames(styles.user__collapsableInfo, isPanelCollapsed && styles.collapsed)}>
                <p className={styles.user__name}>{userName}</p>
                <ContextMenu>{userContextMenu}</ContextMenu>
              </div>
            </div>
          ) : (
            <div className={classNames(styles.guest, isPanelCollapsed && styles.collapsed)}>
              <ContextMenu
                openButton={(onClick: any) => (
                  <div className={classNames(styles.guest__icon, styles.contextMenu)} onClick={onClick}>
                    <UserSvg />
                  </div>
                )}
              >
                {userContextMenu}
              </ContextMenu>

              <p className={styles.guest__collapsableInfo}>
                <span>Guest</span>
                <Link to={LOGIN_ROUTE} className={styles.guest__link}>
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default PrimaryMenu;
