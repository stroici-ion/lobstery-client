import { IUser } from '../profile/types';

export interface IImagesState {
  images: IImage[];
  activeImage?: IImage;
  operation: EImageEditOperations;
  activeIndex: number;
}

export interface IImage {
  id: number;
  orderId: number;
  caption: string;
  image: string;
  imageThumbnail: string;
  aspectRatio: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  video: string | null;
  isVideoFile: boolean;
  taggedFriends?: ITaggedUserImage[];
  taggedFriendsList?: ITaggedUserImage[];
  uploadProgress?: number;
  videoExtension?: string;
  isUpdated?: boolean;
  post?: number;
}

export interface ITaggedUserImage {
  user: IUser;
  top: number;
  left: number;
}

export enum EImageEditOperations {
  TAG = 0,
  CROP = 1,
}

// FETCHED (snake_case)
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
