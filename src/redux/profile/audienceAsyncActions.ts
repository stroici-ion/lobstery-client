import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IAudience,
  ICustomAudiences,
  IDefaultAudience,
  IFetchCustomAudiences,
  IFetchedAudience,
  IFetchedDefaultAudience,
  IUpdateDefaultAudience,
} from './audienceTypes';
import { EFetchStatus } from '../../types/enums';
import $api from '../../http';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';

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
        user_ids: customAudience.users.map((user) => user.id),
      });
    } else if (customAudience.id > -1) {
      response = await $api.get<IFetchedAudience>(`api/posts/audience/${customAudience.id}/details/`);
    } else {
      response = await $api.post<IFetchedAudience>('api/posts/audience/', {
        ...customAudience,
        user_ids: customAudience.users.map((user) => user.id),
      });
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
