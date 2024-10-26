import { RootState } from '..';
import { compareObjects } from '../../utils/compareObjects';

export const selectPosts = (state: RootState) => state.posts.posts;
export const selectPostCreateStatus = (state: RootState) => {
  return { status: state.posts.postCreateStatus, errors: state.posts.errors, progress: state.posts.uploadProgress };
};

export const selectActivePost = (state: RootState) => state.posts.activePost;
// export const selectPostById = (state: RootState, id: number) => state.posts.posts.find((post) => post.id === id);

export const selectPostById = (id: number) => (store: RootState) => store.posts.posts.filter(({ id }) => id === id)[0];
export const getIsPostFormDirty = (store: RootState) => {
  const p = store.posts.activePost;
  const s = store.posts.postSnapshot;
  return !compareObjects(p, s);
};
