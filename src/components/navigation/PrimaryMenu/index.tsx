import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import MenuButton from '../MenuButton';
import styles from './styles.module.scss';

import { FaInfoCircle } from 'react-icons/fa';
import {
  HomeSvg,
  GallerySvg,
  MessagingSvg,
  SettingsSvg,
  LogoSvg,
  GamesSvg,
  CloseAsidePanelSvg,
  OpenAsidePanelSvg,
} from '../../../icons';
import { GAMES_ROUTE, PROFILE_ROUTE, POSTS_ROUTE } from '../../../utils/consts';
import { useAppDispatch } from '../../../redux';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { selectAuthStatus } from '../../../redux/auth/selectors';
import { selectIsPrimaryMenuCollapsed } from '../../../redux/app/selectors';
import { setPrimaryMenuCollapsed } from '../../../redux/app/slice';

const PrimaryMenu: React.FC = () => {
  const dispatch = useAppDispatch();

  const [activeButton, setAcitveButton] = useState(0);

  const isPrimaryMenuCollapsed = useSelector(selectIsPrimaryMenuCollapsed);

  const handleToggleAsidePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setPrimaryMenuCollapsed(!isPrimaryMenuCollapsed));
  };

  return (
    <>
      <aside className={classNames(styles.aside, isPrimaryMenuCollapsed && styles.collapsed)}>
        <div className={classNames(styles.aside__top, styles.top, isPrimaryMenuCollapsed && styles.collapsed)}>
          <Link to={PROFILE_ROUTE} className={styles.top__logo}>
            <div className={styles.top__logoSvg}>
              <LogoSvg />
            </div>
            <div className={styles.top__logoTextSvg}>Lobstery</div>
          </Link>
        </div>
        <div className={classNames(styles.aside__body, styles.body, isPrimaryMenuCollapsed && styles.collapsed)}>
          <div className={styles.body__collapse}>
            <button className={classNames(styles.body__collapseButton)} onClick={handleToggleAsidePanel}>
              {isPrimaryMenuCollapsed ? <OpenAsidePanelSvg /> : <CloseAsidePanelSvg />}
            </button>
          </div>
          <div className={styles.body__buttons}>
            <span className={styles.body__buttonsDecoration} style={{ top: 50 * activeButton }} />
            <Link to={PROFILE_ROUTE}>
              <MenuButton
                collapsed={isPrimaryMenuCollapsed}
                onClick={() => setAcitveButton(0)}
                active={activeButton === 0}
                icon={HomeSvg}
              >
                Home
              </MenuButton>
            </Link>
            <Link to={POSTS_ROUTE}>
              <MenuButton
                collapsed={isPrimaryMenuCollapsed}
                onClick={() => setAcitveButton(1)}
                active={activeButton === 1}
                icon={GallerySvg}
              >
                Posts
              </MenuButton>
            </Link>
            <Link to={POSTS_ROUTE}>
              <MenuButton
                collapsed={isPrimaryMenuCollapsed}
                onClick={() => setAcitveButton(2)}
                active={activeButton === 2}
                icon={MessagingSvg}
              >
                Messaging
              </MenuButton>
            </Link>
            <Link to={GAMES_ROUTE}>
              <MenuButton
                collapsed={isPrimaryMenuCollapsed}
                onClick={() => setAcitveButton(3)}
                active={activeButton === 3}
                icon={GamesSvg}
              >
                Games
              </MenuButton>
            </Link>
          </div>
          <MenuButton collapsed={isPrimaryMenuCollapsed} icon={SettingsSvg} onClick={() => {}}>
            Settings
          </MenuButton>
          <MenuButton collapsed={isPrimaryMenuCollapsed} icon={FaInfoCircle} onClick={() => {}}>
            Info
          </MenuButton>
        </div>
      </aside>
    </>
  );
};

export default PrimaryMenu;
