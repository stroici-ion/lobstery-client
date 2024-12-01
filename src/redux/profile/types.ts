import { EFetchStatus } from '../../types/enums';
import { IFetchError } from '../auth/types';
import { IFetchedImage, IImage } from '../images/types';
import { IFetchedPost, IPost } from '../posts/types';
import { IAudience } from './audienceTypes';

export interface IUserProfileState extends IMyProfile {
  //...My Profile
  users: IUserProfile[];
  userProfileStatus: EFetchStatus;

  customAudiencesCount: number;

  activeCustomAudience: IAudience;
  customAudiencesList: IAudience[];

  defaultAudienceStatus: EFetchStatus;
  customAudienceStatus: EFetchStatus;
  customAudiencesListStatus: EFetchStatus;

  status: EFetchStatus;
  errors?: IFetchError;
}

export interface IUserProfile {
  user: IUser;
  friends: IUser[];
  friendsCount: number;
  mutalFriendsCount: number;
  posts: IPost[];
  images: IImage[];
}

//My profile has some additional properties
export interface IMyProfile {
  user: IUser;
  friends: IUser[];
  friendsCount: number;
  posts: IPost[];
  images: IImage[];

  //Settings
  defaultAudience: number;
  defaultCustomAudience: number;
}

export interface IFetchedUserProfile {
  user: IFetchedUser;
  friends: { user: IFetchedUser }[];
  friendsCount: number;
  mutalFriendsCount: number;
  posts: IFetchedPost[];
  images: IFetchedImage[];
}

export interface IFetchedMyProfile {
  user: IFetchedUser;
  friends: { user: IFetchedUser }[];
  friends_count: number;
  posts: IFetchedPost[];
  images: IFetchedImage[];

  //Settings
  default_audience: number;
  default_custom_audience: number;
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
