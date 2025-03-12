import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';
import Header from '../../components/navigation/Header';
import { PrimaryMenu, PrimaryMenuMobile } from '../../components/navigation';

const MainLayout: React.FC = () => {
  return (
    <div className={styles.root}>
      <Header />
      <PrimaryMenu />
      <PrimaryMenuMobile />
      <div className={styles.root__content}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
