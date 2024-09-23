import { RootState } from '..';

export const selectPosts = (state: RootState) => state.posts.posts;
export const selectActivePost = (state: RootState) => state.posts.activePost;
// export const selectPostById = (state: RootState, id: number) => state.posts.posts.find((post) => post.id === id);

export const selectPostById = (id: number) => (store: RootState) => store.posts.posts.filter(({ id }) => id === id)[0];
