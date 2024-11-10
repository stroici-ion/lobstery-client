import { IFetchedPost } from './IFetchedPost';

export interface FetchPostsResponse {
  count: number;
  results: IFetchedPost[];
}
