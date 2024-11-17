import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import useInput from '../../../../hooks/useInput';
import useInputPassword from '../../../../hooks/useInputPassword';
import Input from '../../Inputs/Input';
import InputPassword from '../../Inputs/InputPassword';
import { fetchAuthRegister } from '../../../../redux/auth/asyncActions';
import { useAppDispatch } from '../../../../redux';
import { useSelector } from 'react-redux';
import { selectAuthErrors, selectRegisterStatus } from '../../../../redux/auth/selectors';
import toast from 'react-hot-toast';
import { logOut } from '../../../../redux/auth/slice';
import { EFetchStatus } from '../../../../types/enums';
import { EAuthFormTypes } from '../../../../pages/Auth/types';

interface IRegisterForm {
  className: string;
  changePositionFast: (formType: EAuthFormTypes) => void;
}

const RegisterForm: React.FC<IRegisterForm> = ({ className, changePositionFast }) => {
  const username = useInput('', { placeholder: 'Username e.g. lobsteryUser22', type: 'text', name: 'username' });
  const firstName = useInput('', { placeholder: 'First Name', type: 'text', name: 'given-name' });
  const lastName = useInput('', { placeholder: 'Last Name', type: 'text', name: 'family-name' });
  const email = useInput('', { placeholder: 'Email', type: 'email', name: 'email' });
  const password = useInputPassword('password', 'Password');
  const confirmPassword = useInputPassword('new-password', 'Confirm Password');
  const dispatch = useAppDispatch();

  const registeredStatus = useSelector(selectRegisterStatus);
  const authErrors = useSelector(selectAuthErrors);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (registeredStatus === EFetchStatus.SUCCESS) {
      changePositionFast(EAuthFormTypes.login);
      toast.success('Register Successfully');
      dispatch(logOut());
    }
  }, [registeredStatus]);

  useEffect(() => {
    const errors = authErrors?.errors || {};
    for (const key in errors) {
      switch (key) {
        case 'username':
          username.setError(errors[key]?.[0] || '');
          break;
        case 'password':
          password.setError(errors[key]?.[0] || '');
          break;
        case 'email':
          email.setError(errors[key]?.[0] || '');
          break;
      }
    }
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

    if (!firstName.value.length) {
      firstName.setError('Field required');
      isValid = false;
    }

    if (!email.value.length) {
      email.setError('Field required');
      isValid = false;
    }

    if (!password.value.length) {
      password.setError('Field required');
      isValid = false;
    } else if (confirmPassword.value !== password.value) {
      confirmPassword.setError('Password not matching');
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateInputs())
      dispatch(
        fetchAuthRegister({
          username: username.value,
          first_name: firstName.value,
          last_name: lastName.value,
          email: email.value,
          password: password.value,
        })
      );
  };

  return (
    <form className={classNames(className, styles.form)}>
      <p className={styles.form__title}>Create account</p>
      <p className={styles.form__errors}>{authErrors && showErrors ? authErrors.message : ''}</p>
      <Input {...username} className={styles.form__inputBox} />
      <div className={styles.form__row}>
        <Input {...firstName} className={styles.form__inputBox} />
        <Input {...lastName} className={styles.form__inputBox} />
      </div>
      <Input {...email} className={styles.form__inputBox} />
      <InputPassword {...password} className={styles.form__inputBox} />
      <InputPassword {...confirmPassword} className={styles.form__inputBox} />
      <button className={styles.form__button} onClick={onSubmit}>
        Sign up
      </button>
      <p className={styles.form__bottomButton} onClick={() => changePositionFast(EAuthFormTypes.login)}>
        Already have an account? <b>Sign In</b>
      </p>
    </form>
  );
};

export default RegisterForm;
