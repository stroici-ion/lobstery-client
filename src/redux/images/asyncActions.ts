import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { setUploadProgress } from './slice';
import { IFetchError } from '../auth/types';
import { IImage } from './types';
import $api from '../../http';

export const fetchCreateImage = createAsyncThunk<
  IImage,
  { image: IImage; postId?: number },
  { rejectValue: IFetchError }
>('images/fetchCreateImage', async ({ image, postId }, { dispatch, rejectWithValue }) => {
  try {
    //* SET FROM DATA FOR IMAGE
    const imageFile = await fetch(image.image);
    const imageBlob = await imageFile.blob();
    const file = new File([imageBlob], v4() + '.webp');
    let video = null;
    if (image.video) {
      const videoFile = await fetch(image.video);
      const videoBlob = await videoFile.blob();
      video = new File([videoBlob], v4() + '.mp4');
    }
    const formData = new FormData();
    if (image) formData.set('image', file);
    if (video) formData.set('video', video);

    formData.set('order_id', image.orderId + '');
    formData.set('caption', image.caption || '');
    formData.set(
      'tagged_friends',
      JSON.stringify(
        image.taggedFriends?.map((obj) => {
          return { ...obj, user: obj.user.id };
        }) || []
      )
    );
    formData.set('post', postId + '');

    //* CREATE IMAGE
    const response = await $api.post<IImage>('/api/images/create/', formData, {
      onUploadProgress: (data) => {
        if (data.total && data.loaded) {
          const progress = Math.round((data.loaded * 100) / data.total);
          dispatch(setUploadProgress({ id: image.id, progress: progress }));
        }
      },
    });
    // URL.revokeObjectURL(image.image);
    dispatch(setUploadProgress({ id: image.id, progress: 100 }));
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue({ message: error.response.data.detail } as IFetchError);
  }
});

export const fetchUpdateImage = createAsyncThunk<IImage, IImage, { rejectValue: IFetchError }>(
  'images/fetchUpdateImage',
  async (image, { rejectWithValue }) => {
    try {
      //* REMOVE IMAGE
      const update = {
        caption: image.caption,
        taggedFriends: JSON.stringify(
          image.taggedFriends?.map((obj) => {
            return { ...obj, user: obj.user.id };
          }) || []
        ),
      };

      const response = await $api.put<IImage>(`/api/images/${image.id}/update/`, update);
      response.data.taggedFriends = response.data.taggedFriendsList;
      return response.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IFetchError);
    }
  }
);

export const fetchRemoveImage = createAsyncThunk<number, number, { rejectValue: IFetchError }>(
  'images/fetchRemoveImage',
  async (id, { rejectWithValue }) => {
    try {
      //* REMOVE IMAGE
      await $api.delete(`/api/images/${id}/delete/`);
      return id;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IFetchError);
    }
  }
);
