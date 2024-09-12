import { IAuthError } from '../../models/auth/IAuthError';
import { IPost, IPostEdit } from '../../models/IPost';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export interface IPostsState {
  uploadProgress: number;
  count: number;
  posts: IPost[];
  status: FetchStatusEnum;
  errors: IAuthError | undefined;
  activePost: IPostEdit;
  newPost?: IPost;
  editPost?: IPost;
}
