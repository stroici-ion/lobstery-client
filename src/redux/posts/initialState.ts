import { FetchStatusEnum } from '../../models/response/FetchStatus';
import { IPostsState } from './types';

export const initialState: IPostsState = {
  activePost: {
    id: -1,
    title: '',
    text: '',
    image_set: [],
    tags: [],
    tagged_friends: [],
    audience: -1,
    fetched_images_id: [],
    custom_audience: -1,
  },
  postSnapshot: undefined,
  count: 0,
  posts: [],
  status: FetchStatusEnum.PENDING,
  uploadProgress: 0,
  postCreateStatus: FetchStatusEnum.PENDING,
  errors: undefined,
};
