import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { LogoSvg } from '../../../icons';
import CartSvg from '../../../icons/CartSvg';

import { useAppDispatch } from '../../../redux';
import { logOut } from '../../../redux/auth/slice';
import { ADD_POST_ROUTE, HOME_ROUTE, POSTS_ROUTE } from '../../../utils/consts';

import styles from './styles.module.scss';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleLogoutClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(logOut());
  };

  return (
    <header className={styles.root}>
      <div className={classNames(styles.root__body, 'container')}>
        <div className={styles.root__logo}>
          <LogoSvg />
          Online store
        </div>
        <ul className={classNames(styles.root__menu, styles.menu)}>
          <li>
            <Link to={HOME_ROUTE}>Home</Link>
          </li>
          <li>Products</li>
          <li>
            <Link to={POSTS_ROUTE}>Posts</Link>
          </li>
          <li>
            <Link to={ADD_POST_ROUTE}>Add Post</Link>
          </li>
        </ul>
        <div className={classNames(styles.root__user, styles.user)}>
          <div className={styles.user__cart}>
            <button>
              <span>17</span>
              <CartSvg />
            </button>
          </div>
          <button onClick={handleLogoutClick}>Log out</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
