import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { Routes, BrowserRouter, Route, Navigate, useLocation } from 'react-router-dom';

import { AUTH_LAYOUT_ROUTE, HOME_ROUTE, MAIN_LAYOUT_ROUTE } from './utils/consts';
import { authRoutes, privateRoutes, publicRoutes } from './routes';
import { selectAuthStatus, selectUserId } from './redux/auth/selectors';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import './styles/styles.scss';
import { useAppDispatch } from './redux';
import { fetchAuthRefresh } from './redux/auth/asyncActions';
import { fetchUserProfile } from './redux/profile/asyncActions';
import styles from './App.module.scss';
import { EFetchStatus } from './types/enums';
import { setGuestStatus } from './redux/auth/slice';
import { fetchDefaultAudience } from './redux/defaultAudience/asyncActions';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const authorizationStatus = useSelector(selectAuthStatus);
  const isAuth = authorizationStatus === EFetchStatus.SUCCESS;
  const userId = useSelector(selectUserId);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) document.documentElement.setAttribute('data-theme', 'dark');

    if (localStorage.getItem('refreshToken')) dispatch(fetchAuthRefresh({}));
    else dispatch(setGuestStatus());
    const onTouchMoove = () => {
      document.body.scroll(0, -10);
    };
    window.addEventListener('touchmove', onTouchMoove);
  }, []);

  useEffect(() => {
    if (isAuth)
      if (userId) {
        dispatch(fetchUserProfile(userId));
        dispatch(fetchDefaultAudience({ userId }));
      }
  }, [isAuth]);

  // useScrollDirection();

  // useEffect(() => {
  //   if (scrollDirection === 'down') {
  //     document.body.style.transform = 'translateY(-50px)'; // Adjust the offset to hide the URL bar
  //   } else if (scrollDirection === 'up') {
  //     document.body.style.transform = 'translateY(0)';
  //   }
  // }, [scrollDirection]);

  return (
    <div className={classNames(styles.scrollArea)}>
      <div>
        <Toaster />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path={AUTH_LAYOUT_ROUTE} element={<AuthLayout />}>
            {!isAuth && authRoutes.map((route) => <Route key={route.path} {...route} />)}
          </Route>
          <Route path={MAIN_LAYOUT_ROUTE} element={<MainLayout />}>
            {publicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {isAuth &&
              privateRoutes.map((route) => <Route key={route.path} path={route.path} element={route.element}></Route>)}
          </Route>
          <Route path="*" element={<Navigate to={HOME_ROUTE} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
