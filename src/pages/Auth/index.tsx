import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../../utils/consts';
import styles from './styles.module.scss';
import mainImage from '../../assets/auth/01.png';
import { useAppDispatch } from '../../redux';
import { fetchAuthLogin, fetchAuthRegister } from '../../redux/auth/asyncActions';
import { useSelector } from 'react-redux';
import { selectAuthErrors, selectRegisterStatus } from '../../redux/auth/selectors';
import { fetchRegisterUser } from '../../services/UserRegister';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

const Auth: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const authErrors = useSelector(selectAuthErrors);
  const registerStatus = useSelector(selectRegisterStatus);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    if (isLogin) {
      dispatch(fetchAuthLogin({ username: data.username, password: data.password }));
      return;
    }
    dispatch(fetchAuthRegister({ username: data.username, password: data.password }));
  });

  useEffect(() => {
    if (registerStatus === FetchStatusEnum.SUCCESS) {
      alert('Success');
    }
  }, [registerStatus]);

  return (
    <div className={styles.root}>
      <div className={styles.root__left}>
        <div className={styles.form}>
          <form onSubmit={onSubmit}>
            {<p className={styles.form__title}>{isLogin ? 'Log in' : 'Register'}</p>}
            <div className={styles.form__inputs}>
              <input type="text" {...register('username')} className={styles.form__input} />
              <input type="password" {...register('password')} className={styles.form__input} />
              {!isLogin && (
                <input
                  type="password"
                  {...register('confirmPassowrd')}
                  className={styles.form__input}
                />
              )}
            </div>
            <p className={styles.form__error}>{authErrors?.message}</p>
            <button className={styles.form__submit}>{isLogin ? 'Log in' : 'Register'}</button>
            {isLogin ? (
              <p>
                Dont have an account <Link to={REGISTRATION_ROUTE}>Register</Link>
              </p>
            ) : (
              <p>
                Already have an account <Link to={LOGIN_ROUTE}>Login</Link>
              </p>
            )}
          </form>
        </div>
      </div>
      <div className={styles.root__right}>
        <img src={mainImage} alt="" />
      </div>
    </div>
  );
};

export default Auth;
