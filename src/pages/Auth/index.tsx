import React, { useState } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import LoginForm from '../../components/UI/Forms/Login';
import RegisterForm from '../../components/UI/Forms/Register';
import { EAuthFormTypes } from './types';

const Auth: React.FC = () => {
  const [form, setForm] = useState(EAuthFormTypes.login);
  const [position, setPosition] = useState(EAuthFormTypes.login);

  const changeForm = (formType: EAuthFormTypes) => {
    setPosition(formType);
    setTimeout(() => {
      setForm(formType);
    }, 300);
  };

  const changePositionFast = (formType: EAuthFormTypes) => {
    setPosition(formType);
    setForm(formType);
  };

  const chsngeBlockStyle = () => {
    if (position === EAuthFormTypes.register) return styles.active;
    if (position === EAuthFormTypes.recover) return styles.center;
    return '';
  };

  return (
    <div className={styles.auth}>
      <div className={styles.auth__body}>
        <div className={classNames(styles.auth__changeBlock, chsngeBlockStyle())}>
          <div className={styles.auth__changeBlock_left}>
            <div className={styles.auth__changeBlock_content}>
              <p className={styles.auth__changeBlock_title}>Hello Friend!</p>
              <p className={styles.auth__changeBlock_text}>
                We're excited to have you here. Connect with others, share your thoughts, and explore endless
                possibilities. Your journey starts now, and we can't wait to see what you create. Let's make amazing
                memories together!
              </p>
              <button className={styles.auth__changeBlock_button} onClick={() => changeForm(EAuthFormTypes.register)}>
                Sign Up
              </button>
            </div>
          </div>
          <div className={styles.auth__changeBlock_top}>
            <div className={styles.auth__changeBlock_content}>
              <p className={styles.auth__changeBlock_title}>Forgot password?</p>
              <p className={styles.auth__changeBlock_text}>{'This feature is not available at the moment :('}</p>
              {/* {form === 2 && (
                <PasswordRecoveryForm changeForm={changeForm} buttonStyles={styles.auth__changeBlock_button} />
              )} */}
              <div className={styles.auth__changeBlock_row}>
                <button
                  className={classNames(styles.auth__changeBlock_button, styles.bigMonitor)}
                  onClick={() => changeForm(EAuthFormTypes.register)}
                >
                  ⮜ Sign Up
                </button>
                <button
                  className={classNames(styles.auth__changeBlock_button, styles.bigMonitor)}
                  onClick={() => changeForm(EAuthFormTypes.login)}
                >
                  Sign In ⮞
                </button>
                <button
                  className={classNames(styles.auth__changeBlock_button, styles.smallMonitor)}
                  onClick={() => changePositionFast(EAuthFormTypes.login)}
                >
                  Sign In
                </button>
                <button
                  className={classNames(styles.auth__changeBlock_button, styles.smallMonitor)}
                  onClick={() => changePositionFast(EAuthFormTypes.register)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
          <div className={styles.auth__changeBlock_right}>
            <div className={styles.auth__changeBlock_content}>
              <p className={styles.auth__changeBlock_title}>Welcome Back!</p>
              <p className={styles.auth__changeBlock_text}>
                We're excited to have you back in the community. Catch up on new posts, reconnect with friends, and
                share what you've been up to. Your voice matters here, so dive in and keep the conversations going.
                Let's continue making great moments together!
              </p>
              <button className={styles.auth__changeBlock_button} onClick={() => changeForm(EAuthFormTypes.login)}>
                Sign In
              </button>
            </div>
          </div>
        </div>
        <div className={classNames(styles.auth__formBlock, position === EAuthFormTypes.register && styles.active)}>
          {form === EAuthFormTypes.login && (
            <LoginForm
              changeForm={changeForm}
              changePositionFast={changePositionFast}
              className={styles.auth__formBlock_form}
            />
          )}
          {form === EAuthFormTypes.register && (
            <RegisterForm changePositionFast={changePositionFast} className={styles.auth__formBlock_form} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
