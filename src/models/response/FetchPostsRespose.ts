import { IPost } from '../IPost';

export interface FetchPostsResponse {
  count: number;
  results: IPost[];
}
