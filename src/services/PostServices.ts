import $api from '../http';
import { IAudience } from '../models/IAudience';
import { IPost } from '../models/IPost';
import { ILikesInfo } from '../models/comments/IComment';

export const putLikePost = async (post: number, like: boolean) => {
  try {
    const { data } = await $api.post<ILikesInfo>('api/posts/' + post + '/likes/', {
      like,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const fetchPostDetail = async (id: number) => {
  try {
    const { data } = await $api.get<IPost>(`api/posts/${id}`);
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const fetchDeletePost = async (post: number) => {
  const { data } = await $api.delete('api/posts/' + post + '/delete/');
  return data;
};
