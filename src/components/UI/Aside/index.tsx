import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import MenuButton from './core/MenuButton';
import styles from './styles.module.scss';

import { HomeSvg, GallerySvg, MessagingSvg, SettingsSvg, LogoSvg, LogOutSvg, GamesSvg, ChessSvg } from '../../../icons';
import { GAMES_ROUTE, HOME_ROUTE, LOGIN_ROUTE, POSTS_ROUTE, USER_SETTINGS_ROUTE } from '../../../utils/consts';
import { logOut } from '../../../redux/auth/slice';
import { useAppDispatch } from '../../../redux';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../redux/profile/selectors';
import ContextMenu from '../../ContextMenu';
import classNames from 'classnames';

const Aside: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeButton, setAcitveButton] = useState(0);
  const userProfile = useSelector(selectUserProfile);

  const handleLogout = () => {
    dispatch(logOut());
    navigate(LOGIN_ROUTE);
  };

  return (
    <aside className={styles.header}>
      <Link to="/home">
        <div className={styles.header__logo}>
          <LogoSvg />
        </div>
      </Link>
      <div className={styles.header__buttons}>
        <span className={styles.header__buttons_decoration} style={{ top: 40 + 70 * activeButton }} />
        <Link to={HOME_ROUTE}>
          <MenuButton onClick={() => setAcitveButton(0)} active={activeButton === 0} icon={HomeSvg} />
        </Link>
        <Link to={POSTS_ROUTE}>
          <MenuButton onClick={() => setAcitveButton(1)} active={activeButton === 1} icon={GallerySvg} />
        </Link>
        <Link to={POSTS_ROUTE}>
          <MenuButton onClick={() => setAcitveButton(2)} active={activeButton === 2} icon={MessagingSvg} />
        </Link>
        <Link to={GAMES_ROUTE}>
          <MenuButton className={styles.gamesButton} onClick={() => setAcitveButton(3)} active={activeButton === 3} icon={ChessSvg} />
        </Link>
        <Link to={GAMES_ROUTE}>
          <MenuButton onClick={() => setAcitveButton(4)} active={activeButton === 4} icon={SettingsSvg} />
        </Link>
      </div>
      <div>
        {userProfile && (
          <ContextMenu
            openButton={(onClick: any) => (
              <button className={styles.user__openMenuButton} onClick={onClick}>
                <img className={styles.user__img} src={userProfile?.profile?.avatar_thumbnail} />
              </button>
            )}
          >
            <button className={classNames(styles.user__button, styles.profile)} onClick={() => navigate(USER_SETTINGS_ROUTE)}>
              <HomeSvg />
              Profile
            </button>
            <button className={classNames(styles.user__button, styles.logout)} onClick={handleLogout}>
              <LogOutSvg />
              Log out
            </button>
          </ContextMenu>
        )}
      </div>
    </aside>
  );
};

export default Aside;
