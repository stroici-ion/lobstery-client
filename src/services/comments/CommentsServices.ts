import $api from '../../http';
import { IComment, IFetchedComment, IFetchedReply, IReply } from '../../models/comments/IComment';
import { IFetchedLikesInfo, ILikesInfo } from '../../models/likes/ILikesInfo';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';

export const getComments = async (id: number, page: number, sortBy: string, user?: number) => {
  try {
    const { data } = await $api.get<{
      results: IFetchedComment[];
      count: number;
    }>('api/posts/comments/' + id + '/', {
      params: {
        page,
        limit: 10,
        offset: (page - 1) * 10,
        sort_by: sortBy,
        user,
      },
    });
    return convertKeysToCamelCase(data) as { count: number; results: IComment[] };
  } catch (e) {
    console.error(e);
  }
};

export const createComment = async (params: { text: string; post: number; user: number }) => {
  try {
    const { data } = await $api.post<IFetchedComment>('api/posts/comments/', params);
    if (data) {
      return convertKeysToCamelCase(data) as IComment;
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
    const { data } = await $api.post<IFetchedLikesInfo>('api/posts/comments/' + comment + '/likes/', {
      like,
    });
    return convertKeysToCamelCase(data) as ILikesInfo;
  } catch (e) {
    console.error(e);
  }
};

export const createReply = async (postId: number, commentId: number, text: string, mentionedUserId?: number) => {
  try {
    const { data } = await $api.post<IFetchedReply>('api/posts/comments/', {
      text,
      post: postId,
      comment: commentId,
      mentioned_user: mentionedUserId,
    });
    if (data) {
      return convertKeysToCamelCase(data) as IReply;
    } else {
      console.error('Error sending answer');
    }
  } catch (e) {
    console.error(e);
  }
};

export const getReplies = async (comment: number, page: number, user?: number) => {
  try {
    const { data } = await $api.get<{
      results: IReply[];
      count: number;
    }>('api/posts/replies/' + comment + '/', {
      params: {
        page,
        limit: 10,
        offset: (page - 1) * 10,
        user,
      },
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const putCommentLikeByAuthor = async (commentId: number) => {
  try {
    const response = await $api.post<{ is_liked_by_author: boolean }>(
      'api/posts/comments/' + commentId + '/like_by_author/'
    );
    return { isLikedByAuthor: response.data.is_liked_by_author, success: response.status === 200 };
  } catch (e) {
    console.error(e);
  }
};

export const togglePinnedComment = async (post: number, comment: number) => {
  try {
    const { data } = await $api.post<{ pinned_comment: number }>('api/posts/' + post + '/pin-comment/', {
      comment,
    });
    return data;
  } catch (e) {
    console.error(e);
  }
};
