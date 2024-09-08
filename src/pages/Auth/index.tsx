import React, { useState } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import LoginForm from './core/Forms/LoginForm';
import RegisterForm from './core/Forms/RegisterForm';

// const location = useLocation();
// const dispatch = useAppDispatch();
// const isLogin = location.pathname === LOGIN_ROUTE;
// const authErrors = useSelector(selectAuthErrors);
// const registerStatus = useSelector(selectRegisterStatus);
// const navigate = useNavigate();

// const { register, handleSubmit } = useForm();

// const onSubmit = handleSubmit(async (data) => {
//   if (isLogin) {
//     dispatch(fetchAuthLogin({ username: data.username, password: data.password }));
//     return;
//   }
//   dispatch(fetchAuthRegister({ username: data.username, password: data.password }));
// });

// useEffect(() => {
//   if (registerStatus === FetchStatusEnum.SUCCESS) {
//     alert('Success');
//   }
// }, [registerStatus]);

export enum EnumFromTypes {
  login = 0,
  register = 1,
  recover = 2,
}

const Auth: React.FC = () => {
  const [form, setForm] = useState(EnumFromTypes.login);
  const [position, setPosition] = useState(1);

  const changeForm = (formType: EnumFromTypes) => {
    setPosition(formType);
    setTimeout(() => {
      setForm(formType);
    }, 300);
  };

  const changePositionFast = (formType: EnumFromTypes) => {
    setPosition(formType);
    setForm(formType);
  };

  const chsngeBlockStyle = () => {
    if (position === 1) return styles.active;
    if (position === 2) return styles.center;
    return '';
  };

  return (
    <div className={styles.auth}>
      <div className={styles.auth__body}>
        <div className={classNames(styles.auth__changeBlock, chsngeBlockStyle())}>
          <div className={styles.auth__changeBlock_left}>
            <div className={styles.auth__changeBlock_content}>
              <p className={styles.auth__changeBlock_title}>Welcome Back!</p>
              <p className={styles.auth__changeBlock_text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, temporibus at. Magni reiciendis
                consequatur ipsa. Mollitia, voluptatibus. Temporibus.
              </p>
              <button className={styles.auth__changeBlock_button} onClick={() => changeForm(1)}>
                Sign in
              </button>
            </div>
          </div>
          <div className={styles.auth__changeBlock_top}>
            <div className={styles.auth__changeBlock_content}>
              <p className={styles.auth__changeBlock_title}>Forgot password?</p>
              {/* {form === 2 && (
                <PasswordRecoveryForm changeForm={changeForm} buttonStyles={styles.auth__changeBlock_button} />
              )} */}
              <div className={styles.auth__changeBlock_row}>
                <button
                  className={classNames(styles.auth__changeBlock_button, styles.bigMonitor)}
                  onClick={() => changeForm(1)}
                >
                  ⮜ Sign in
                </button>
                <button
                  className={classNames(styles.auth__changeBlock_button, styles.bigMonitor)}
                  onClick={() => changeForm(0)}
                >
                  Sign up ⮞
                </button>
                <button
                  className={classNames(styles.auth__changeBlock_button, styles.smallMonitor)}
                  onClick={() => changePositionFast(1)}
                >
                  Sign in
                </button>
                <button
                  className={classNames(styles.auth__changeBlock_button, styles.smallMonitor)}
                  onClick={() => changePositionFast(0)}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
          <div className={styles.auth__changeBlock_right}>
            <div className={styles.auth__changeBlock_content}>
              <p className={styles.auth__changeBlock_title}>Hello Friend!</p>
              <p className={styles.auth__changeBlock_text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, temporibus at. Magni reiciendis
                consequatur ipsa. Mollitia, voluptatibus. Temporibus.
              </p>
              <button className={styles.auth__changeBlock_button} onClick={() => changeForm(0)}>
                Sign up
              </button>
            </div>
          </div>
        </div>
        <div className={classNames(styles.auth__formBlock, position === 1 && styles.active)}>
          {form === 1 && (
            <LoginForm
              changeForm={changeForm}
              changePositionFast={changePositionFast}
              className={styles.auth__formBlock_form}
            />
          )}
          {form === 0 && (
            <RegisterForm changePositionFast={changePositionFast} className={styles.auth__formBlock_form} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
