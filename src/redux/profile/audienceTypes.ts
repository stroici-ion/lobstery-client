import { EFetchStatus } from '../../types/enums';
import { IFetchedUser, IUser } from './types';

export interface IAudience {
  id: number;
  title: string;
  audience: number;
  users: IUser[];
}

export interface IDefaultAudienceState {
  defaultAudience: number;
  defaultCustomAudience: number;
  customAudiencesCount: number;
  activeCustomAudience: IAudience;
  defaultAudienceStatus: EFetchStatus;
  customAudienceStatus: EFetchStatus;
  customAudiencesListStatus: EFetchStatus;
  customAudiencesList: IAudience[];
}

export interface IDefaultAudience {
  defaultAudience: number;
  defaultCustomAudience: number;
}

export interface IUpdateDefaultAudience {
  defaultAudience?: number;
  defaultCustomAudience?: number;
}

export interface ICustomAudiences {
  count: number;
  results: IAudience[];
}

// FETCHED (snake_case)
export interface IFetchedAudience {
  id: number;
  title: string;
  audience: number;
  users: IFetchedUser[];
}

export interface IFetchedDefaultAudience {
  default_audience: number;
  default_custom_audience: number;
}

export interface IFetchCustomAudiences {
  count: number;
  results: IFetchedAudience[];
}
