import classNames from 'classnames';
import { Outlet } from 'react-router-dom';
import React from 'react';

import styles from './styles.module.scss';
import { PrimaryMenu, PrimaryMenuMobile } from '../../components/navigation';
import Header from '../../components/navigation/Header';

const MainLayout: React.FC = () => {
  return (
    <div className={styles.root}>
      <Header />
      <PrimaryMenu />
      <PrimaryMenuMobile />
      <div className={classNames(styles.root__content, 'wrapper')}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
