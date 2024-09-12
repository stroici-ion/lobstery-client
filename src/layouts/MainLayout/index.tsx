import classNames from 'classnames';
import { Outlet } from 'react-router-dom';
import React from 'react';

import Aside from '../../components/UI/Aside';
import styles from './styles.module.scss';
import Header from '../../components/UI/Header';

const MainLayout: React.FC = () => {
  return (
    <div className={styles.root}>
      <Aside />
      <div className={classNames(styles.root__content, 'wrapper')}>
        {/* <Header /> */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
