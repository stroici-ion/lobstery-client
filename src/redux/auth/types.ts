import { IFetchedUser, IUser } from '../profile/types';
import { EFetchStatus } from '../../types/enums';

export interface IFetchError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface IAuthResponse {
  access: string;
  refresh: string;
  user: IUser;
}

export interface IFetchedAuthResponse {
  access: string;
  refresh: string;
  user: IFetchedUser;
}

export interface IAuthState {
  userId?: number;
  loading: boolean;

  loginStatus: EFetchStatus;
  registerStatus: EFetchStatus;

  errors?: IFetchError;
}
