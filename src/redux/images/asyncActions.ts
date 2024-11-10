import { createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../../http';
import { setUploadProgress } from './slice';
import { IImage } from '../../models/images/IImage';
import { v4 } from 'uuid';
import { IAuthError } from '../../models/auth/IAuthError';

export const fetchCreateImage = createAsyncThunk<
  IImage,
  { image: IImage; postId?: number },
  { rejectValue: IAuthError }
>('images/fetchCreateImage', async ({ image, postId }, { dispatch, rejectWithValue }) => {
  try {
    //* SET FROM DATA FOR IMAGE
    const imageFile = await fetch(image.image);
    const imageBlob = await imageFile.blob();
    const file = new File([imageBlob], v4() + '.jpg');
    let video = null;
    if (image.isVideoFile && image.video && image.videoExtension) {
      const videoFile = await fetch(image.video);
      const videoBlob = await videoFile.blob();
      video = new File([videoBlob], v4() + '.' + image.videoExtension);
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
    URL.revokeObjectURL(image.image);
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue({ message: error.response.data.detail } as IAuthError);
  }
});

export const fetchUpdateImage = createAsyncThunk<IImage, IImage, { rejectValue: IAuthError }>(
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
      return rejectWithValue({ message: error.response.data.detail } as IAuthError);
    }
  }
);

export const fetchRemoveImage = createAsyncThunk<number, number, { rejectValue: IAuthError }>(
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
      return rejectWithValue({ message: error.response.data.detail } as IAuthError);
    }
  }
);
