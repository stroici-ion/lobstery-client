import { FetchStatusEnum } from '../../models/response/FetchStatus';
import { IPostsState } from './types';

export const initialState: IPostsState = {
  activePost: {
    id: -1,
    title: '',
    text: '',
    imageSet: [],
    tags: [],
    taggedFriends: [],
    audience: -1,
    fetchedImagesId: [],
    customAudience: -1,
  },
  postSnapshot: undefined,
  count: 0,
  posts: [],
  status: FetchStatusEnum.PENDING,
  uploadProgress: 0,
  postCreateStatus: FetchStatusEnum.PENDING,
  errors: undefined,
};
