import classNames from 'classnames';
import { Outlet } from 'react-router-dom';
import React from 'react';

import styles from './styles.module.scss';
import { PrimaryMenu, PrimaryMenuMobile } from '../../components/navigation';

const MainLayout: React.FC = () => {
  return (
    <div className={styles.root}>
      <PrimaryMenu />
      <PrimaryMenuMobile />
      <div className={classNames(styles.root__content, 'wrapper')}>
        {/* <Header /> */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
