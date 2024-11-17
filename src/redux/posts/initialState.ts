import { EFetchStatus } from '../../types/enums';
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
  status: EFetchStatus.PENDING,
  uploadProgress: 0,
  postCreateStatus: EFetchStatus.PENDING,
  errors: undefined,
};
