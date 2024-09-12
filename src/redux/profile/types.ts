import { IAuthError } from '../../models/auth/IAuthError';
import { IUser } from '../../models/IUser';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export interface IUserProfileState {
  user: IUser;
  status: FetchStatusEnum;
  errors?: IAuthError;
}
