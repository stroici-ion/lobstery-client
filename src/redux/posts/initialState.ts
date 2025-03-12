import { EFetchStatus } from '../../types/enums';
import { IPostsState } from './types';

export const getEmptyPost = () => {
  return {
    id: -1,
    title: '',
    text: '',
    imageSet: [],
    tags: [],
    taggedFriends: [],
    fetchedImagesId: [],
    audience: -1,
    customAudience: -1,
    favorite: false,
  };
};

export const initialState: IPostsState = {
  count: 0,
  posts: [],

  activePost: getEmptyPost(),
  postSnapshot: undefined,
  uploadProgress: 0,
  postCreateStatus: EFetchStatus.PENDING,
  isPostFormVisible: false,

  loading: true,
  status: EFetchStatus.PENDING,
  errors: undefined,
};
