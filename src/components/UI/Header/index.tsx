import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import styles from './styles.module.scss';

import { HomeSvg, GallerySvg, MessagingSvg, SettingsSvg, LogoSvg, LogOutSvg, ChessSvg, UserSvg } from '../../../icons';
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

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeButton, setAcitveButton] = useState(0);
  const user = useSelector(selectUserProfile);

  const authorizationStatus = useSelector(selectAuthStatus);
  const isAuth = authorizationStatus === FetchStatusEnum.SUCCESS;

  const handleLogout = () => {
    if (isAuth) dispatch(logOut());
    navigate(LOGIN_ROUTE);
  };

  return <header className={styles.header}></header>;
};

export default Header;
