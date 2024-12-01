import { createAsyncThunk } from '@reduxjs/toolkit';

import { IFetchedMyProfile, IFetchedUserProfile, IMyProfile, IUserProfile } from './types';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';
import { IFetchError } from '../auth/types';
import $api from '../../http';

export const fetchMyProfile = createAsyncThunk<IMyProfile, number, { rejectValue: IFetchError }>(
  'profile/fetchMyProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await $api.get<IFetchedMyProfile>('api/profiles/' + userId);
      return convertKeysToCamelCase({
        ...response.data,
        friends: response.data.friends.map((f) => f.user),
      }) as IMyProfile;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IFetchError);
    }
  }
);

export const fetchUserProfile = createAsyncThunk<IUserProfile, number, { rejectValue: IFetchError }>(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await $api.get<IFetchedUserProfile>('api/profiles/user/' + userId);
      return convertKeysToCamelCase({
        ...response.data,
        friends: response.data.friends.map((f) => f.user),
      }) as IUserProfile;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IFetchError);
    }
  }
);
