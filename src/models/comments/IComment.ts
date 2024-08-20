import { IUser } from '../IUser';

export interface IComment extends Omit<IReply, 'parent' | 'reply_to'> {
  replies_count: number;
  is_pinned_by_author?: boolean;
  is_replied_by_author: boolean;
}

export interface IReply extends ILikesInfo {
  id: number;
  text: string;
  created_at: string;
  updated_at: string;
  liked_by_author: boolean;
  post: number;
  parent: number;
  user: IUser;
  reply_to?: IUser;
}

export interface ILikesInfo {
  liked: boolean;
  disliked: boolean;
  likes_count: number;
  dislikes_count: number;
}
