import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import styles from './styles.module.scss';

import { LOGIN_ROUTE } from '../../../utils/consts';
import { logOut } from '../../../redux/auth/slice';
import { useAppDispatch } from '../../../redux';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../redux/profile/selectors';
import ContextMenu from '../../ContextMenu';
import classNames from 'classnames';
import { selectAuthStatus } from '../../../redux/auth/selectors';
import UserImage from '../../UserImage';
import { EFetchStatus } from '../../../types/enums';
import { primaryMenuMobileLinks } from '../../../config/navigation/primaryMenuMobileConfig';

const PrimaryMenu: React.FC = () => {
  const [activeLink, setActiveLink] = useState(0);
  const user = useSelector(selectUserProfile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isAuth) dispatch(logOut());
    navigate(LOGIN_ROUTE);
  };

  const authorizationStatus = useSelector(selectAuthStatus);
  const isAuth = authorizationStatus === EFetchStatus.SUCCESS;

  return (
    <nav className={styles.menu}>
      <div className={styles.menu__body}>
        <div className={styles.menu__decoration} style={{ left: 50 * activeLink }} />
        {primaryMenuMobileLinks.links.map((link, index) => (
          <Link
            className={classNames(styles.link, index === activeLink && styles.active)}
            to={link.path}
            key={link.id}
            onClick={() => setActiveLink(index)}
          >
            {link.icon}
          </Link>
        ))}
        {isAuth && user.id ? (
          <Link
            className={classNames(styles.link, primaryMenuMobileLinks.links.length === activeLink && styles.active)}
            onClick={() => setActiveLink(primaryMenuMobileLinks.links.length)}
            to={primaryMenuMobileLinks.user.path}
          >
            <UserImage className={styles.user} user={user} />
          </Link>
        ) : (
          <ContextMenu
            className={styles.contextMenu}
            openButton={(onClick: any) => (
              <div
                onClick={() => {
                  setActiveLink(primaryMenuMobileLinks.links.length);
                  onClick();
                }}
                className={classNames(
                  styles.link,
                  styles.guest__icon,
                  primaryMenuMobileLinks.links.length === activeLink && styles.active
                )}
              >
                <>{primaryMenuMobileLinks.guest.icon}</>
              </div>
            )}
          >
            {primaryMenuMobileLinks.guest.contextMenuLinks.map((link) => (
              <Link
                to={link.path}
                key={link.id}
                className={classNames(
                  styles.contextMenu__link,
                  primaryMenuMobileLinks.links.length === activeLink && styles.active
                )}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </ContextMenu>
        )}
      </div>
    </nav>
  );
};

export default PrimaryMenu;
