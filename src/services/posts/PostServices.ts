import $api from '../../http';
import { IFetchedPost, IPost } from '../../redux/posts/types';
import { IFetchedLikesInfo, ILikesInfo } from '../../types/LikesInfo.types';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';

export const putLikePost = async (post: number, like: boolean) => {
  try {
    const { data } = await $api.post<IFetchedLikesInfo>('api/posts/' + post + '/likes/', {
      like,
    });
    return convertKeysToCamelCase(data) as ILikesInfo;
  } catch (e) {
    console.error(e);
  }
};

export const fetchPostDetail = async (id: number) => {
  try {
    const { data } = await $api.get<IFetchedPost>(`api/posts/${id}/details`);

    return convertKeysToCamelCase(data) as IPost;
  } catch (e) {
    console.error(e);
  }
};

export const fetchDeletePost = async (post: number) => {
  const { data } = await $api.delete('api/posts/' + post + '/delete/');
  return data;
};
