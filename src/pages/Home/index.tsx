import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Product from '../../components/Product';
import { selectAuthStatus } from '../../redux/auth/selectors';
import { LOGIN_ROUTE } from '../../utils/consts';

import styles from './styles.module.scss';

const Home: React.FC = () => {
  const isAuth = useSelector(selectAuthStatus);

  return (
    <div className={styles.root}>
      <div className="container">
        <div>{!isAuth && <Link to={LOGIN_ROUTE}>LOG IN</Link>}</div>

        <div className={styles.root__products}>
          <Product />
          <Product />
          <Product />
          <Product />
        </div>
      </div>
    </div>
  );
};

export default Home;
