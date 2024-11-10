import { IAudience } from './IAudience';
import { IUser } from '../IUser';

export interface FetchCustomAudienceResponse extends IAudience {
  users_list: IUser[];
}

export interface IFetchCustomAudiencesList {
  count: number;
  results: IAudience[];
}
