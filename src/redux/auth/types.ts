import { IUser } from '../../models/IUser';
import { IAuthError } from '../../models/response/AuthResonse';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export interface IAuthState {
  userId?: number;
  status: FetchStatusEnum;
  registerStatus: FetchStatusEnum;
  errors: IAuthError | undefined;
}
