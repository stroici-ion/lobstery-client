import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { EnumFromTypes } from '../../../../models/auth/EnumFormTypes';
import useInput from '../../../../hooks/useInput';
import useInputPassword from '../../../../hooks/useInputPassword';
import Input from '../../Inputs/Input';
import InputPassword from '../../Inputs/InputPassword';

interface IRegisterForm {
  className: string;
  //   changeForm: (formType: EnumFromTypes) => void;
  changePositionFast: (formType: EnumFromTypes) => void;
}

const RegisterForm: React.FC<IRegisterForm> = ({ className, changePositionFast }) => {
  const username = useInput('', { placeholder: 'Username e.g. lobsteryUser22', type: 'text', name: 'username' });
  const firstName = useInput('', { placeholder: 'First Name', type: 'text', name: 'firstname' });
  const lastName = useInput('', { placeholder: 'Last Name', type: 'text', name: 'lastname' });
  const email = useInput('', { placeholder: 'Email', type: 'email', name: 'email' });
  const password = useInputPassword('password', 'Password');
  const confirmPassword = useInputPassword('confirmpassword', 'Confirm Password');

  //   const registerClick = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await AuthService.registration(email.value, password.value, name.value);
  //       localStorage.setItem('token', response.accessToken);
  //       setUser(response.user);
  //       navigate(HOME_ROUTE);
  //     } catch (e) {
  //       console.log(e.response?.data?.message);
  //     }
  //   };

  return (
    <form className={classNames(className, styles.form)}>
      <p className={styles.form__title}>Create account</p>
      <p className={styles.form__useEmail}></p>
      <Input {...username} className={styles.form__inputBox} />
      <div className={styles.form__row}>
        <Input {...firstName} className={styles.form__inputBox} />
        <Input {...lastName} className={styles.form__inputBox} />
      </div>
      <Input {...email} className={styles.form__inputBox} />
      <InputPassword {...password} className={styles.form__inputBox} />
      <InputPassword {...confirmPassword} className={styles.form__inputBox} />
      <button className={styles.form__button}>Sign up</button>
      <p className={styles.form__bottomButton} onClick={() => changePositionFast(1)}>
        Already have an account? <b>Sign In</b>
      </p>
    </form>
  );
};

export default RegisterForm;
