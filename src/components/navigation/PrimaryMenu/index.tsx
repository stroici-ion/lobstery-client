import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import MenuButton from '../MenuButton';
import styles from './styles.module.scss';

import {
  HomeSvg,
  GallerySvg,
  MessagingSvg,
  SettingsSvg,
  LogoSvg,
  GamesSvg,
  CloseAsidePanelSvg,
  OpenAsidePanelSvg,
  DarkModeSvg,
} from '../../../icons';
import { GAMES_ROUTE, PROFILE_ROUTE, LOGIN_ROUTE, POSTS_ROUTE } from '../../../utils/consts';
import { logOut } from '../../../redux/auth/slice';
import { useAppDispatch } from '../../../redux';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { selectAuthStatus } from '../../../redux/auth/selectors';
import { EFetchStatus } from '../../../types/enums';

const PrimaryMenu: React.FC = () => {
  const [activeButton, setAcitveButton] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const isAuth = useSelector(selectAuthStatus);

  const handleToggleAsidePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  return (
    <>
      <aside className={classNames(styles.aside, isPanelCollapsed && styles.collapsed)}>
        <div className={classNames(styles.aside__top, styles.top, isPanelCollapsed && styles.collapsed)}>
          <Link to={PROFILE_ROUTE} className={styles.top__logo}>
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
            <Link to={PROFILE_ROUTE}>
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
          </div>
          <MenuButton icon={SettingsSvg} onClick={() => {}}>
            Settings
          </MenuButton>
        </div>
      </aside>
    </>
  );
};

export default PrimaryMenu;
