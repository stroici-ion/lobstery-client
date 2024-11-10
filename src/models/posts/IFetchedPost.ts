import { IFetchedImage } from '../images/IFetchedImage';
import { IUser } from '../IUser';
import { IFetchedLikesInfo } from '../likes/ILikesInfo';
import { TGridCell } from '../media-tools/images-grid';

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
