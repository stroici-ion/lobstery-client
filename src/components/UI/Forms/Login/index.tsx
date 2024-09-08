import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import useInput from '../../../../hooks/useInput';
import useInputPassword from '../../../../hooks/useInputPassword';
import { EnumFromTypes } from '../../../../models/auth/EnumFormTypes';
import Input from '../../Inputs/Input';
import InputPassword from '../../Inputs/InputPassword';
import { fetchAuthLogin } from '../../../../redux/auth/asyncActions';
import { useAppDispatch } from '../../../../redux';

interface ILoginForm {
  className: string;
  changeForm: (formType: EnumFromTypes) => void;
  changePositionFast: (formType: EnumFromTypes) => void;
}

const LoginForm: React.FC<ILoginForm> = ({ className, changeForm, changePositionFast }) => {
  const username = useInput('', { placeholder: 'Username e.g. lobsteryUser22', type: 'text', name: 'username' });
  const password = useInputPassword('Password');
  const dispatch = useAppDispatch();

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(fetchAuthLogin({ username: username.value, password: password.value }));
  };

  return (
    <form className={classNames(className, styles.form)}>
      <p className={styles.form__title}>Sign in</p>
      <p className={styles.form__useEmail}>or use your account</p>
      <Input {...username} className={styles.form__inputBox} />
      <InputPassword {...password} className={styles.form__inputBox} />
      <p className={styles.form__frogotPassword_slow} onClick={() => changeForm(2)}>
        Forgot your password?
      </p>
      <p className={styles.form__frogotPassword_fast} onClick={() => changePositionFast(2)}>
        Forgot your password?
      </p>
      <button className={styles.form__button} onClick={onSubmit}>
        Sign in
      </button>
      <p className={styles.form__bottomButton} onClick={() => changePositionFast(0)}>
        Don't have an account? <b>Sign Up</b>
      </p>
    </form>
  );
};

export default LoginForm;
