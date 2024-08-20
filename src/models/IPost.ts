import { type } from 'os';
import { ILikesInfo } from './comments/IComment';
import { IImage } from './IImage';
import { IUser } from './IUser';

export interface IPost extends ILikesInfo {
  id: number;
  title: string;
  text: string;
  image_set: IImage[];
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

interface ExcludeKeys extends ILikesInfo {
  user: IUser;
  created_at: Date;
  comments_count: number;
  viewsCount: number;
  updated_at: Date;
}

export interface IPostEdit extends Omit<IPost, keyof ExcludeKeys> {
  fetched_images_id: number[];
  upload_progress: number;
}
