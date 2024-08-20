import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';

const AuthLayout: React.FC = () => {
  return (
    <div className="wrapper">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
