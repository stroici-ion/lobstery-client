import { RootState } from '..';
import { compareObjects } from '../../utils/compareObjects';
import { getEmptyPost } from './initialState';

export const selectIsPostFormVisible = (state: RootState) => state.posts.isPostFormVisible;

export const selectPostsStatus = (state: RootState) => state.posts;

export const selectPostCreateStatus = (state: RootState) => {
  return { status: state.posts.postCreateStatus, errors: state.posts.errors, progress: state.posts.uploadProgress };
};

export const selectActivePost = (state: RootState) => state.posts.activePost;
