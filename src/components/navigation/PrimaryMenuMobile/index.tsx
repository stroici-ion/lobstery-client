import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';

import styles from './styles.module.scss';

import { LOGIN_ROUTE } from '../../../utils/consts';
import { logOut } from '../../../redux/auth/slice';
import { useAppDispatch } from '../../../redux';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../redux/profile/selectors';
// import ContextMenu from '../../ContextMenu';
import classNames from 'classnames';
import { selectAuthStatus } from '../../../redux/auth/selectors';
import UserImage from '../../UserImage';
import { EFetchStatus } from '../../../types/enums';
import { primaryMenuMobileLinks } from '../../../config/navigation/primaryMenuMobileConfig';
import RippleButton from '../../UI/buttons/RippleButton';
import btnStyles from '../../../styles/components/buttons/rippleButtons.module.scss';
import useSwipe from '../../../hooks/useSwipe';
import ContextMenu from '../../UI/ContextMenu';
import { useContextMenu } from '../../../hooks/useContextMenu';

const PrimaryMenu: React.FC = () => {
  const { userId } = useSelector(selectAuthStatus);

  const [activeLink, setActiveLink] = useState(0);
  const [isSwipeUpActive, setIsSwipeUpActive] = useState(false);
  const user = useSelector(selectUserProfile).user;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useSwipe({
    onSwipe: () => {
      setIsSwipeUpActive(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsSwipeUpActive(false);
      }, 2000);
    },
    direction: 'up',
    threshold: 20,
  });

  useSwipe({
    onSwipe: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsSwipeUpActive(false);
    },
    direction: 'down',
    threshold: 20,
  });

  const handleLogout = () => {
    if (userId) dispatch(logOut());
    navigate(LOGIN_ROUTE);
  };

  const ctx = useContextMenu();

  return (
    <nav className={classNames(styles.menu, isSwipeUpActive && styles.transparent)}>
      <div className={styles.menu__body}>
        <div className={styles.menu__decoration} style={{ left: 50 * activeLink }} />
        {primaryMenuMobileLinks.links.map((link, index) => (
          <Link className={styles.link} to={link.path} key={link.id} onClick={() => setActiveLink(index)}>
            <RippleButton className={classNames(styles.link__button, btnStyles.lightMain)}>{link.icon}</RippleButton>
          </Link>
        ))}
        {userId && user.id ? (
          <Link
            className={styles.link}
            to={primaryMenuMobileLinks.user.path}
            onClick={() => setActiveLink(primaryMenuMobileLinks.links.length)}
          >
            <RippleButton className={classNames(styles.link__button, btnStyles.lightMain)}>
              <UserImage className={styles.user} user={user} />
            </RippleButton>
          </Link>
        ) : (
          <>
            <button
              ref={ctx.triggerRef}
              onClick={() => {
                setActiveLink(primaryMenuMobileLinks.links.length);
                ctx.onShow();
              }}
              className={classNames(
                styles.link,
                styles.guest__icon,
                primaryMenuMobileLinks.links.length === activeLink && styles.active
              )}
            >
              <>{primaryMenuMobileLinks.guest.icon}</>
            </button>
            {ctx.isOpen && (
              <ContextMenu {...ctx}>
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
          </>
        )}
      </div>
    </nav>
  );
};

export default PrimaryMenu;
