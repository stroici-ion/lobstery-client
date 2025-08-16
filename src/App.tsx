import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom';

import { AUTH_LAYOUT_ROUTE, PROFILE_ROUTE, MAIN_LAYOUT_ROUTE } from './utils/consts';
import { authRoutes, privateRoutes, publicRoutes } from './routes';
import { selectAuthStatus } from './redux/auth/selectors';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import './styles/styles.scss';
import { useAppDispatch } from './redux';
import { fetchMe } from './redux/profile/asyncActions';
import { setGuestStatus } from './redux/auth/slice';
import Loader from './components/Loader';
import Modal from './components/UI/modals/Modal';
import { useModalDialog } from './hooks/useModalDialog';
import { selectIsPostFormVisible } from './redux/posts/selectors';
import { setIsPostFormVisible } from './redux/posts/slice';
import AddPostForm from './components/AddPostForm';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const { userId, loading } = useSelector(selectAuthStatus);

  const modal = useModalDialog();
  const isPostFormVisible = useSelector(selectIsPostFormVisible);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) dispatch(fetchMe());
    else {
      dispatch(setGuestStatus());
    }

    const onTouchMoove = () => {
      document.body.scroll(0, -10);
    };

    window.addEventListener('touchmove', onTouchMoove);
  }, []);

  // useEffect(() => {
  //   if (isAddPostFormDirty) {
  //     modal.dialog.setDialogParams(dirtyFormWarningDialog);
  //     window.alert('Becomes dirty');
  //   } else modal.dialog.setDialogParams(undefined);
  // }, [isAddPostFormDirty]);

  useEffect(() => {
    isPostFormVisible && modal.open();
    if (!modal.isOpen) dispatch(setIsPostFormVisible(false));
  }, [isPostFormVisible, modal.isOpen]);

  if (loading) return <Loader />;

  return (
    <>
      <div>
        <Toaster />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path={AUTH_LAYOUT_ROUTE} element={<AuthLayout />}>
            {!userId && authRoutes.map((route) => <Route key={route.path} {...route} />)}
          </Route>
          <Route path={MAIN_LAYOUT_ROUTE} element={<MainLayout />}>
            {publicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {userId &&
              privateRoutes.map((route) => <Route key={route.path} path={route.path} element={route.element}></Route>)}
          </Route>
          <Route path="*" element={<Navigate to={PROFILE_ROUTE} />} />
        </Routes>
        <Modal {...modal}>
          <AddPostForm onHide={modal.onHide} forceHide={modal.forceHide} />
        </Modal>
      </BrowserRouter>
    </>
  );
};

export default App;
