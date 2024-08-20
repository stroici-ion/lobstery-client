import { IUser } from '../IUser';

export interface IAuthResponse {
  access: string;
  refresh: string;
  user: IUser;
}

export interface IAuthError {
  message: string;
  errors?: [];
}
