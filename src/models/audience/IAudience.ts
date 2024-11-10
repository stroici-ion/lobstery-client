import { IUser } from '../IUser';

export interface IAudience {
  id: number;
  title: string;
  audience: number;
  audience_list: IUser[];
}

export interface IDefaultAudience {
  defaultAudience: number;
  defaultCustomAudience: number;
}

export interface IUpdateDefaultAudience {
  defaultAudience?: number;
  defaultCustomAudience?: number;
}

export interface IFetchedDefaultAudience {
  default_audience: number;
  default_custom_audience: number;
}
