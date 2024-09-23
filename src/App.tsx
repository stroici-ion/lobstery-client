import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom';

import { AUTH_LAYOUT_ROUTE, HOME_ROUTE, LOGIN_ROUTE, MAIN_LAYOUT_ROUTE } from './utils/consts';
import { authRoutes, privateRoutes, publicRoutes } from './routes';
import { selectAuthStatus, selectUserId } from './redux/auth/selectors';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import './styles/styles.scss';
import { useAppDispatch } from './redux';
import { fetchAuthRefresh } from './redux/auth/asyncActions';
import { fetchUserProfile } from './redux/profile/asyncActions';
import classNames from 'classnames';
import styles from './App.module.scss';
import Modal from './components/UI/Modal';
import EditImagesForm from './components/EditImagesForm';
import { selectActiveImage } from './redux/images/selectors';
import { selectImagesModalStatus, selectPostCreateModalStatus } from './redux/modals/selectors';
import { setImagesModalStatus } from './redux/modals/slice';
import { Toaster } from 'react-hot-toast';
import { FetchStatusEnum } from './models/response/FetchStatus';
import { setGuestStatus } from './redux/auth/slice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeImage = useSelector(selectActiveImage);
  const imagesModalStatus = useSelector(selectImagesModalStatus);
  const postCreateModalStatus = useSelector(selectPostCreateModalStatus);

  const authorizationStatus = useSelector(selectAuthStatus);
  const isAuth = authorizationStatus === FetchStatusEnum.SUCCESS;
  const userId = useSelector(selectUserId);

  useEffect(() => {
    if (localStorage.getItem('refreshToken')) dispatch(fetchAuthRefresh({}));
    else dispatch(setGuestStatus());
  }, []);

  useEffect(() => {
    if (isAuth)
      if (userId) {
        dispatch(fetchUserProfile(userId));
      }
  }, [isAuth]);

  const handleImagesModalHide = () => {
    dispatch(setImagesModalStatus(false));
  };

  return (
    <div className={classNames(styles.scrollArea, (imagesModalStatus || postCreateModalStatus) && styles.lockScroll)}>
      {/* {imagesModalStatus && activeImage && (
        <Modal fullSize={true} onHide={handleImagesModalHide}>
          <EditImagesForm onHide={handleImagesModalHide} />
        </Modal>
      )} */}

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
              <Route key={route.path} {...route} />
            ))}
            {isAuth &&
              privateRoutes.map((route) => <Route key={route.path} path={route.path} element={route.element} />)}
          </Route>
          <Route path='*' element={<Navigate to={HOME_ROUTE} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
