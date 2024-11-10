import { IFetchedUser, IUser } from '../IUser';
import { IFetchedLikesInfo, ILikesInfo } from '../likes/ILikesInfo';

export interface ICommentBase extends ILikesInfo {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  isLikedByAuthor: boolean;
  user: IUser;
}

export interface IComment extends ICommentBase {
  post: number;
  repliesCount: number;
  isPinnedByAuthor: boolean;
  isRepliedByAuthor: boolean;
}

export interface IReply extends ICommentBase {
  post: number;
  comment: number;
  mentionedUser?: IUser;
}

export interface IFetchedCommentBase extends IFetchedLikesInfo {
  id: number;
  text: string;
  created_at: string;
  updated_at: string;
  is_liked_by_author: boolean;
  user: IFetchedUser;
}

export interface IFetchedComment extends IFetchedCommentBase {
  post: number;
  replies_count: number;
  is_pinned_by_author: boolean;
  is_replied_by_author: boolean;
}

export interface IFetchedReply extends IFetchedCommentBase {
  post: number;
  comment: number;
  mentioned_user?: IFetchedUser;
}
