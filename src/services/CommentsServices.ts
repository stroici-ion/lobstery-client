import $api from '../http';
import { IComment, ILikesInfo, IReply } from '../models/comments/IComment';

export const getComments = async (id: number, page: number, sortBy: string) => {
  try {
    const { data } = await $api.get<{
      results: IComment[];
      count: number;
    }>('api/posts/comments/' + id + '/', {
      params: {
        page,
        limit: 10,
        offset: (page - 1) * 10,
        sort_by: sortBy,
      },
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const createComment = async (params: { text: string; post: number; user: number }) => {
  try {
    const { data } = await $api.post<{
      id: number;
      text: string;
      created_at: string;
      updated_at: string;
      post: number;
    }>('api/posts/comments/', params);
    if (data) {
      return data;
    } else {
      console.error('Error sending comment');
    }
  } catch (e) {
    console.error(e);
  }
};

export const editComment = async (id: number, text: string) => {
  try {
    const { data } = await $api.put<IComment>('api/posts/comments/' + id + '/update/', { text });
    if (data) {
      return data;
    } else {
      console.error('Error while editing comment');
    }
  } catch (e) {
    console.error(e);
  }
};

export const removeComment = async (id: number) => {
  try {
    const res = await $api.delete<{
      text: string;
      updatedAt: string;
    }>('api/posts/comments/' + id + '/delete/');
    if (res) {
      return res.status === 204;
    } else {
      console.error('Error while deleting comment');
    }
  } catch (e) {
    console.error(e);
  }
};

export const putCommentLike = async (comment: number, like: boolean) => {
  try {
    const { data } = await $api.post<ILikesInfo>('api/posts/comments/' + comment + '/likes/', {
      like,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const createReply = async (params: {
  text: string;
  post: number;
  user: number;
  parent: number;
  reply_to?: number;
}) => {
  try {
    const { data } = await $api.post<{
      id: number;
      post: number;
      parent: number;
      text: string;
      created_at: string;
      updated_at: string;
    }>('api/posts/comments/', params);
    if (data) {
      return data;
    } else {
      console.error('Error sending answer');
    }
  } catch (e) {
    console.error(e);
  }
};

export const getReplies = async (comment: number, page: number) => {
  try {
    const { data } = await $api.get<{
      results: IReply[];
      count: number;
    }>('api/posts/replies/' + comment + '/', {
      params: {
        page,
        limit: 10,
        offset: (page - 1) * 10,
      },
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const putCommentLikeByAuthor = async (commentId: number) => {
  try {
    const response = await $api.post<{ liked_by_author: boolean }>(
      'api/posts/comments/' + commentId + '/like_by_author/'
    );
    return { data: response.data, success: response.status === 200 };
  } catch (e) {
    console.error(e);
  }
};

export const togglePinnedComment = async (post: number, comment: number) => {
  try {
    const { data } = await $api.post<{ pinned_comment: number }>(
      'api/posts/' + post + '/pin-comment/',
      {
        comment,
      }
    );
    return data;
  } catch (e) {
    console.error(e);
  }
};
