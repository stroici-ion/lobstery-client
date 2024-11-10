import { ITaggedUserImage } from './IImage';

export interface IFetchedImage {
  id: number;
  order_id: number;
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
  video_extension?: string;
  isUpdated?: boolean;
  post?: number;
}
