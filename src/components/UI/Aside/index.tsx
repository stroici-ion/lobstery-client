import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import MenuButton from './core/MenuButton';
import styles from './styles.module.scss';

import {
  HomeSvg,
  GallerySvg,
  MessagingSvg,
  SettingsSvg,
  LogoSvg,
  LogOutSvg,
  ChessSvg,
  UserSvg,
  GamesSvg,
  CloseAsidePanelSvg,
  OpenAsidePanelSvg,
  LogoTextSvg,
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
import { FetchStatusEnum } from '../../../models/response/FetchStatus';
import SmallButton from '../Buttons/SmallButton';

const Aside: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeButton, setAcitveButton] = useState(0);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);
  const user = useSelector(selectUserProfile);
  const isPanelCollapsedRef = useRef(false);

  const authorizationStatus = useSelector(selectAuthStatus);
  const isAuth = authorizationStatus === FetchStatusEnum.SUCCESS;

  const handleLogout = () => {
    if (isAuth) dispatch(logOut());
    navigate(LOGIN_ROUTE);
  };

  const handleWindowOnResize = () => {
    if (window.innerWidth <= 768) {
      setIsPanelCollapsed(true);
    } else {
      setIsPanelCollapsed(false);
    }
  };

  useEffect(() => {
    if (window.innerWidth > 768) setIsPanelCollapsed(false);
    window.addEventListener('resize', handleWindowOnResize);
    return () => window.removeEventListener('resize', handleWindowOnResize);
  }, []);

  const handleToggleAsidePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    isPanelCollapsedRef.current = !isPanelCollapsed;
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  const userName = `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`;

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
          <button
            className={classNames(styles.top__menuButton, !isPanelCollapsed && styles.collapsed)}
            onClick={handleToggleAsidePanel}
          >
            <span />
            <span />
            <span />
          </button>
          <Link to={HOME_ROUTE} className={styles.top__logo}>
            <div className={styles.top__logoSvg}>
              <LogoSvg />
            </div>
            <div className={styles.top__logoTextSvg}>Lobstery</div>
          </Link>
        </div>
        <div className={classNames(styles.aside__asideBody, styles.asideBody, isPanelCollapsed && styles.collapsed)}>
          <div className={styles.asideBody__collapse}>
            <button className={classNames(styles.asideBody__collapseButton)} onClick={handleToggleAsidePanel}>
              {isPanelCollapsed ? <OpenAsidePanelSvg /> : <CloseAsidePanelSvg />}
            </button>
          </div>
          <div className={styles.asideBody__buttons}>
            <span className={styles.asideBody__buttonsDecoration} style={{ top: 50 * activeButton }} />
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
          </div>
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
                  <div className={styles.guest__icon} onClick={onClick}>
                    <UserSvg />
                  </div>
                )}
              >
                {userContextMenu}
              </ContextMenu>

              <p className={styles.guest__text}>
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

export default Aside;
