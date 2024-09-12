import { IAuthError } from '../../models/auth/IAuthError';
import { IUser } from '../../models/IUser';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export interface IAuthState {
  userId?: number;
  status: FetchStatusEnum;
  registerStatus: FetchStatusEnum;
  errors: IAuthError | undefined;
}
