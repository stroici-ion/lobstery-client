import { EFetchStatus } from '../../types/enums';
import { IFetchError } from '../auth/types';

export interface IUserProfileState {
  user: IUser;
  status: EFetchStatus;
  errors?: IFetchError;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  profile?: {
    avatar: string;
    avatarThumbnail: string;
    cover: string;
  };
}

export interface IFetchedUser {
  id: number;
  first_name: string;
  last_name: string;
  profile?: {
    avatar: string;
    avatar_thumbnail: string;
    cover: string;
  };
}
