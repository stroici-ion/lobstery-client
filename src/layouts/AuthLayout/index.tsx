import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';

const AuthLayout: React.FC = () => {
  return (
    <div className={styles.root}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
