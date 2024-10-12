import { FetchStatusEnum } from '../../models/response/FetchStatus';
import { IPostsState } from './types';

export const initialState: IPostsState = {
  uploadProgress: 0,
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
    upload_progress: 0,
  },
  postSnapshot: undefined,
  count: 0,
  posts: [],
  status: FetchStatusEnum.PENDING,
  errors: undefined,
};
