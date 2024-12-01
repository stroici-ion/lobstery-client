import { createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../../http';

import { fetchCreateImage, fetchRemoveImage, fetchUpdateImage } from '../images/asyncActions';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';
import { FetchPostsResponse, IPost, IPostEdit } from './types';
import { setUploadProgress } from './slice';
import { IFetchError } from '../auth/types';
import { IImage } from '../images/types';
import { IFetchedLikesInfo, ILikesInfo } from '../../types/LikesInfo.types';

export const fetchPostsByUser = createAsyncThunk<
  { count: number; posts: IPost[] },
  Record<string, string>,
  { rejectValue: IFetchError }
>('posts/fetchPostsByUser', async (params, { rejectWithValue }) => {
  try {
    const res = await $api.get<FetchPostsResponse>('api/posts/', { params });
    return { count: res.data.count, posts: convertKeysToCamelCase(res.data.results) as IPost[] };
  } catch (error: any) {
    if (!error.response) {
      alert(error);
    }
    return rejectWithValue({ message: error.response.data.detail } as IFetchError);
  }
});

export const fetchPosts = createAsyncThunk<
  { count: number; posts: IPost[] },
  Record<string, string | undefined>,
  { rejectValue: IFetchError }
>('posts/fetchPosts', async (params, { rejectWithValue }) => {
  try {
    const res = await $api.get<FetchPostsResponse>('api/posts/', { params });
    return { count: res.data.count, posts: convertKeysToCamelCase(res.data.results) as IPost[] };
  } catch (error: any) {
    if (!error.response) {
      alert(error);
    }
    return rejectWithValue({ message: error.response.data.detail } as IFetchError);
  }
});

export const fetchCreatePost = createAsyncThunk<
  IPost,
  { post: IPostEdit; images: IImage[] },
  { rejectValue: IFetchError }
>('posts/fetchCreatePost', async ({ post, images }, { dispatch, rejectWithValue }) => {
  try {
    console.log(post.customAudience);

    const newPost = await $api[post.id && post.id >= 0 ? 'put' : 'post']<IPost>(
      `/api/posts/${post.id && post.id >= 0 ? post.id + '/update' : 'create'}/`,
      {
        images_layout: post.imagesLayout,
        title: post.title || '',
        text: post.text || '',
        feeling: post.feeling || '',
        tags: post.tags || [],
        tagged_friends: post.taggedFriends?.map((friend) => friend.id) || [],
        audience: post.audience,
        custom_audience: post.customAudience,
      }
    );

    const newImages = images.filter((image) => image.id < 0);
    const updatedImages = images.filter((image) => image.isUpdated && image.id >= 0);
    const newPostImagesId = images.map((image) => image.id);
    const removedImagesId = post.fetchedImagesId.filter((imageId) => !newPostImagesId.includes(imageId));

    for await (const image of updatedImages) {
      await dispatch(fetchUpdateImage(image));
    }

    for await (const image of newImages) {
      await dispatch(fetchCreateImage({ image, postId: newPost.data.id }));
    }

    for await (const id of removedImagesId) {
      await dispatch(fetchRemoveImage(id));
    }

    try {
      const finalResult = await $api.get<IPost>(`/api/posts/${newPost.data.id}/details/`);
      dispatch(setUploadProgress(100));
      return convertKeysToCamelCase(finalResult.data) as IPost;
    } catch {
      return rejectWithValue({ message: 'Something went wrong' } as IFetchError);
    }
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue({ message: error.response.data.detail } as IFetchError);
  }
});

export const fetchRemovePost = createAsyncThunk<number, number, { rejectValue: IFetchError }>(
  'posts/fetchRemovePost',
  async (id, { rejectWithValue }) => {
    try {
      await $api.delete('api/posts/' + id + '/delete/');
      return id;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IFetchError);
    }
  }
);

export const fetchLikePost = createAsyncThunk<
  { id: number; likesInfo: ILikesInfo },
  { postId: number; like: boolean },
  { rejectValue: IFetchError }
>('posts/fetchLikePost', async ({ postId, like }, { rejectWithValue }) => {
  try {
    const res = await $api.post<IFetchedLikesInfo>('api/posts/' + postId + '/likes/', {
      like,
    });
    return { id: postId, likesInfo: convertKeysToCamelCase(res.data) as ILikesInfo };
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue({ message: error.response.data.detail } as IFetchError);
  }
});

export const fetchFavoritePost = createAsyncThunk<
  { id: number; favorite: boolean },
  number,
  { rejectValue: IFetchError }
>('posts/fetchFavoritePost', async (postId, { rejectWithValue }) => {
  try {
    const res = await $api.post<{ id: number; favorite: boolean }>('api/posts/favorite/', {
      post_id: postId,
    });
    return res.data as { id: number; favorite: boolean };
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue({ message: error.response.data.detail } as IFetchError);
  }
});
