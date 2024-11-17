import { IFetchedLikesInfo, ILikesInfo } from '../../types/LikesInfo.types';
import { TGridCell } from '../../components/media/ImageGrid/types';
import { IFetchedImage, IImage } from '../images/types';
import { IUser } from '../profile/types';
import { EFetchStatus } from '../../types/enums';
import { IFetchError } from '../auth/types';

export interface IPostsState {
  uploadProgress: number;
  count: number;
  posts: IPost[];
  status: EFetchStatus;
  postCreateStatus: EFetchStatus;
  errors?: IFetchError;
  activePost: IPostEdit;
  postSnapshot?: IPostEdit;
}

export interface IPost extends ILikesInfo {
  id: number;
  title: string;
  text: string;
  imageSet: IImage[];
  imagesLayout?: TGridCell;
  tags: string[];
  feeling?: string;
  viewsCount: number;
  commentsCount: number;
  user: IUser;
  taggedFriends: IUser[];
  createdAt: Date;
  updatedAt: Date;
  audience: number;
  customAudience: number;
}

interface ExcludeKeys extends ILikesInfo {
  user: IUser;
  createdAt: Date;
  commentsCount: number;
  viewsCount: number;
  updatedAt: Date;
}

export interface IPostEdit extends Omit<IPost, keyof ExcludeKeys> {
  fetchedImagesId: number[];
}

// FETCHED (snake_case)
export interface IFetchedPost extends IFetchedLikesInfo {
  id: number;
  title: string;
  text: string;
  image_set: IFetchedImage[];
  images_layout?: TGridCell;
  tags: string[];
  feeling?: string;
  viewsCount: number;
  comments_count: number;
  user: IUser;
  tagged_friends: IUser[];
  created_at: Date;
  updated_at: Date;
  audience: number;
  custom_audience: number;
}

export interface FetchPostsResponse {
  count: number;
  results: IFetchedPost[];
}
