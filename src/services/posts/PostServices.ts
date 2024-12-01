import $api from '../../http';
import { IFetchedPost, IPost } from '../../redux/posts/types';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';

export const fetchPostDetail = async (id: number) => {
  try {
    const { data } = await $api.get<IFetchedPost>(`api/posts/${id}/details`);

    return convertKeysToCamelCase(data) as IPost;
  } catch (e) {
    console.error(e);
  }
};
