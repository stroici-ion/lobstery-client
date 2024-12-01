import { EFetchStatus } from '../../types/enums';
import { IPostsState } from './types';

export const initialState: IPostsState = {
  count: 0,
  posts: [],

  activePost: {
    id: -1,
    title: '',
    text: '',
    imageSet: [],
    tags: [],
    taggedFriends: [],
    fetchedImagesId: [],
    audience: -1,
    customAudience: -1,
  },
  postSnapshot: undefined,
  uploadProgress: 0,
  postCreateStatus: EFetchStatus.PENDING,

  status: EFetchStatus.PENDING,
  errors: undefined,
};
