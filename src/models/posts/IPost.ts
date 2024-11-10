import { IImage } from '../images/IImage';
import { IUser } from '../IUser';
import { ILikesInfo } from '../likes/ILikesInfo';
import { TGridCell } from '../media-tools/images-grid';

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
