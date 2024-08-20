import { IUser } from './IUser';

export interface IImage {
  id: number;
  caption: string;
  image: string;
  image_thumbnail: string;
  aspect_ratio: number;
  thumbnail_width: number;
  thumbnail_height: number;
  video: string | null;
  is_video_file: boolean;
  tagged_friends?: ITaggedUserImage[];
  tagged_friends_list?: ITaggedUserImage[];
  upload_progress?: number;
  video_extension?: string;
  isUpdated?: boolean;
  post?: number;
}

interface ITaggedUserImage {
  user: IUser;
  top: number;
  left: number;
}
