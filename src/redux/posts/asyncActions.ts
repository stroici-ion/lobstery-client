import { createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../../http';

import { fetchCreateImage, fetchRemoveImage, fetchUpdateImage } from '../images/asyncActions';
import { FetchPostsResponse } from '../../models/response/FetchPostsRespose';
import { setActivePost, setUploadProgress } from './slice';
import { setPostCreateModalStatus } from '../modals/slice';
import { IAuthError } from '../../models/auth/IAuthError';
import { IPost, IPostEdit } from '../../models/IPost';
import { IImage } from '../../models/IImage';

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchPosts = createAsyncThunk<
  FetchPostsResponse,
  Record<string, string | undefined>,
  { rejectValue: IAuthError }
>('posts/fetchPosts', async (params, { rejectWithValue }) => {
  try {
    const response = await $api.get<FetchPostsResponse>(apiUrl + 'api/posts/', { params });
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue({ message: error.response.data.detail } as IAuthError);
  }
});

export const fetchCreatePost = createAsyncThunk<
  IPost,
  { post: IPostEdit; images: IImage[] },
  { rejectValue: IAuthError }
>('posts/fetchCreatePost', async ({ post, images }, { dispatch, getState, rejectWithValue }) => {
  try {
    const newPost = await $api[post.id && post.id >= 0 ? 'put' : 'post']<IPost>(
      `/api/posts/${post.id && post.id >= 0 ? post.id + '/update' : 'create'}/`,
      {
        title: post.title || '',
        text: post.text || '',
        feeling: post.feeling || '',
        tags: post.tags || [],
        tagged_friends: post.tagged_friends?.map((friend) => friend.id) || [],
        audience: post.audience,
        custom_audience: post.custom_audience,
      },
      {
        onUploadProgress: (data) => {
          if (data.total && data.loaded) {
            const progress = Math.round((data.loaded * 100) / data.total);
            dispatch(setUploadProgress(progress));
          }
        },
      }
    );

    const newImages = images.filter((image) => image.id < 0);
    const updatedImages = images.filter((image) => image.isUpdated && image.id >= 0);
    const newPostImagesId = images.map((image) => image.id);
    const removedImagesId = post.fetched_images_id.filter((imageId) => !newPostImagesId.includes(imageId));

    for await (const image of updatedImages) {
      await dispatch(fetchUpdateImage(image));
    }

    for await (const image of newImages) {
      await dispatch(fetchCreateImage({ image, postId: newPost.data.id }));
    }

    for await (const id of removedImagesId) {
      await dispatch(fetchRemoveImage(id));
    }

    const finalResult = await $api.get<IPost>(`/api/posts/${newPost.data.id}`);

    dispatch(setPostCreateModalStatus(false));
    dispatch(setActivePost());
    return finalResult.data;
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
