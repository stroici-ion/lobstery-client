import classNames from 'classnames';
import { Outlet } from 'react-router-dom';
import React from 'react';

import Aside from '../../components/UI/Aside';
import styles from './styles.module.scss';

const MainLayout: React.FC = () => {
  return (
    <div className={classNames(styles.root, 'wrapper')}>
      <Aside />
      <Outlet />
    </div>
  );
};

export default MainLayout;
