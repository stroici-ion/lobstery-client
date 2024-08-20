import { IUser } from '../../models/IUser';
import { IAuthError } from '../../models/response/AuthResonse';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export interface IUserProfileState {
  user: IUser;
  status: FetchStatusEnum;
  errors?: IAuthError;
}
