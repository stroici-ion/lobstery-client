import { IUser } from '../IUser';

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
