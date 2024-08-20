import { IUser } from './IUser';

export interface IAudience {
  id: number;
  title: string;
  audience: number;
  audience_list: IUser[];
}

export interface IDefaultAudience {
  default_audience: number;
  default_custom_audience: number;
}
