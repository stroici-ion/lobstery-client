import { createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../../http';
import { EFetchStatus } from '../../types/enums';

import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';
import toast from 'react-hot-toast';
import {
  IAudience,
  ICustomAudiences,
  IDefaultAudience,
  IFetchCustomAudiences,
  IFetchedAudience,
  IFetchedDefaultAudience,
  IUpdateDefaultAudience,
} from './types';

//DEFAULT AUDIENCE FOR USER PROFILE
export const fetchDefaultAudience = createAsyncThunk<
  IDefaultAudience,
  { userId: number } & IUpdateDefaultAudience,
  { rejectValue: EFetchStatus }
>('posts/fetchDefaultAudience', async ({ userId, defaultAudience, defaultCustomAudience }, { rejectWithValue }) => {
  try {
    const response = await $api[
      defaultAudience !== undefined || defaultCustomAudience !== undefined ? 'put' : 'get'
    ]<IFetchedDefaultAudience>(`api/profiles/${userId}/audience/`, {
      default_audience: defaultAudience,
      default_custom_audience: defaultCustomAudience,
    });

    return convertKeysToCamelCase(response.data) as IDefaultAudience;
  } catch (error: any) {
    toast.error(error.response.data.message);
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(EFetchStatus.ERROR);
  }
});

//CUSTOM AUDIENCE CREATE/RETRIEVE/UPDATE
export const fetchCustomAudience = createAsyncThunk<
  IAudience,
  { customAudience: IAudience; update?: boolean },
  { rejectValue: EFetchStatus }
>('posts/fetchCustomAudience', async ({ customAudience, update = false }, { rejectWithValue }) => {
  try {
    let response;
    if (update) {
      response = await $api.put<IFetchedAudience>(`api/posts/audience/${customAudience.id}/update/`, {
        ...customAudience,
        users: customAudience.users.map((user) => user.id),
      });
      response.data.users = response.data.users;
    } else if (customAudience.id > -1) {
      response = await $api.get<IFetchedAudience>(`api/posts/audience/${customAudience.id}/details/`);
    } else {
      response = await $api.post<IFetchedAudience>('api/posts/audience/', {
        ...customAudience,
        users: customAudience.users.map((user) => user.id),
      });
      response.data.users = response.data.users;
    }
    return convertKeysToCamelCase(response.data) as IAudience;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(EFetchStatus.ERROR);
  }
});

//CUSTOM AUDIENCE DELETE
export const fetchDeleteCustomAudience = createAsyncThunk<IDefaultAudience, number, { rejectValue: EFetchStatus }>(
  'posts/fetchDeleteCustomAudience',
  async (id, { rejectWithValue }) => {
    try {
      const response = await $api.delete<IFetchedDefaultAudience>(`api/posts/audience/${id}/delete/`);
      return convertKeysToCamelCase(response.data) as IDefaultAudience;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(EFetchStatus.ERROR);
    }
  }
);

//CUSTOM AUDIENCES LIST
export const fetchCustomAudiencesList = createAsyncThunk<ICustomAudiences, number, { rejectValue: EFetchStatus }>(
  'posts/fetchCustomAudiences',
  async (id, { rejectWithValue }) => {
    try {
      const response = await $api.get<IFetchCustomAudiences>('api/posts/audience/' + id + '/list/');
      return convertKeysToCamelCase(response.data) as ICustomAudiences;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(EFetchStatus.ERROR);
    }
  }
);
