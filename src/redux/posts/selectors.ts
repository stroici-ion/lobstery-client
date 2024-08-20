import { RootState } from '..';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export const selectPosts = (state: RootState) => state.posts.posts;
export const selectActivePost = (state: RootState) => state.posts.activePost;
