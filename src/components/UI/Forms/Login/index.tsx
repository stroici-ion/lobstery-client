import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import useInput from '../../../../hooks/useInput';
import useInputPassword from '../../../../hooks/useInputPassword';
import Input from '../../Inputs/Input';
import InputPassword from '../../Inputs/InputPassword';
import { fetchAuthLogin } from '../../../../redux/auth/asyncActions';
import { useAppDispatch } from '../../../../redux';
import { useSelector } from 'react-redux';
import { selectAuthErrors } from '../../../../redux/auth/selectors';
import { EAuthFormTypes } from '../../../../pages/Auth/types';

interface ILoginForm {
  className: string;
  changeForm: (formType: EAuthFormTypes) => void;
  changePositionFast: (formType: EAuthFormTypes) => void;
}

const LoginForm: React.FC<ILoginForm> = ({ className, changeForm, changePositionFast }) => {
  const username = useInput('', { placeholder: 'Username e.g. lobsteryUser22', type: 'text', name: 'username' });
  const password = useInputPassword('password', 'Password');
  const dispatch = useAppDispatch();

  const authErrors = useSelector(selectAuthErrors);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    setShowErrors(true);
  }, [authErrors]);

  useEffect(() => {
    setShowErrors(false);
  }, [username.value, password.value]);

  const validateInputs = () => {
    let isValid = true;
    if (!username.value.length) {
      username.setError('Field required');
      isValid = false;
    }
    if (!password.value.length) {
      password.setError('Field required');
      isValid = false;
    }
    return isValid;
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateInputs()) dispatch(fetchAuthLogin({ username: username.value, password: password.value }));
  };

  return (
    <form className={classNames(className, styles.form)}>
      <p className={styles.form__title}>Sign in</p>
      <p className={styles.form__errors}>{authErrors && showErrors ? authErrors.message : ''}</p>
      <Input {...username} className={styles.form__inputBox} />
      <InputPassword {...password} className={styles.form__inputBox} />

      <button className={styles.form__button} onClick={onSubmit}>
        Sign in
      </button>

      <p className={styles.form__frogotPassword_slow} onClick={() => changeForm(EAuthFormTypes.recover)}>
        Forgot your password?
      </p>

      <p className={styles.form__frogotPassword_fast} onClick={() => changePositionFast(EAuthFormTypes.recover)}>
        Forgot your password?
      </p>

      <p className={styles.form__bottomButton} onClick={() => changePositionFast(EAuthFormTypes.register)}>
        Don't have an account? <b>Sign Up</b>
      </p>
    </form>
  );
};

export default LoginForm;
