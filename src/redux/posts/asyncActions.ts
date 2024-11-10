import { createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../../http';

import { fetchCreateImage, fetchRemoveImage, fetchUpdateImage } from '../images/asyncActions';
import { FetchPostsResponse } from '../../models/posts/FetchPostsResponse';
import { setUploadProgress } from './slice';
import { IAuthError } from '../../models/auth/IAuthError';
import { IPost, IPostEdit } from '../../models/posts/IPost';
import { IImage } from '../../models/images/IImage';
import { IFetchedPost } from '../../models/posts/IFetchedPost';
import { IFetchedImage } from '../../models/images/IFetchedImage';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchPosts = createAsyncThunk<
  { count: number; posts: IPost[] },
  Record<string, string | undefined>,
  { rejectValue: IAuthError }
>('posts/fetchPosts', async (params, { rejectWithValue }) => {
  try {
    const res = await $api.get<FetchPostsResponse>(apiUrl + 'api/posts/', { params });
    return { count: res.data.count, posts: convertKeysToCamelCase(res.data.results) as IPost[] };
  } catch (error: any) {
    if (!error.response) {
      alert(error);
    }
    return rejectWithValue({ message: error.response.data.detail } as IAuthError);
  }
});

export const fetchCreatePost = createAsyncThunk<
  IPost,
  { post: IPostEdit; images: IImage[] },
  { rejectValue: IAuthError }
>('posts/fetchCreatePost', async ({ post, images }, { dispatch, rejectWithValue }) => {
  try {
    const newPost = await $api[post.id && post.id >= 0 ? 'put' : 'post']<IPost>(
      `/api/posts/${post.id && post.id >= 0 ? post.id + '/update' : 'create'}/`,
      {
        imagesLayout: post.imagesLayout,
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
      return finalResult.data;
    } catch {
      return rejectWithValue({ message: 'Something went wrong' } as IAuthError);
    }
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue({ message: error.response.data.detail } as IAuthError);
  }
});

export const fetchRemovePost = createAsyncThunk<number, number, { rejectValue: IAuthError }>(
  'posts/fetchRemovePost',
  async (id, { rejectWithValue }) => {
    try {
      await $api.delete('api/posts/' + id + '/delete/');
      return id;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IAuthError);
    }
  }
);
