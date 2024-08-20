import { createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../../http';
import { FetchStatusEnum } from '../../models/response/FetchStatus';
import {
  FetchCustomAudienceResponse,
  FetchDefaultAudienceResponse,
  IFetchCustomAudiencesList,
} from '../../models/response/FetchDefaultAudienceResponse';
import { IAudience } from '../../models/IAudience';

//*=========================================================CUSTOM
export const fetchDefaultAudience = createAsyncThunk<
  FetchDefaultAudienceResponse,
  { userId: number; default_audience?: number; default_custom_audience?: number },
  { rejectValue: FetchStatusEnum }
>(
  'posts/fetchDefaultAudience',
  async ({ userId, default_audience, default_custom_audience }, { rejectWithValue }) => {
    try {
      const response = await $api[
        default_audience !== undefined || default_custom_audience !== undefined ? 'put' : 'get'
      ]<{
        default_audience: number;
        default_custom_audience: number;
      }>(`api/profiles/${userId}/audience/`, { default_audience, default_custom_audience });

      return response.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(FetchStatusEnum.ERROR);
    }
  }
);

//*=========================================================CUSTOM AUDIENCE CREATE/RETRIEVE/UPDATE
export const fetchCustomAudience = createAsyncThunk<
  IAudience,
  { customAudience: IAudience; update?: boolean },
  { rejectValue: FetchStatusEnum }
>('posts/fetchCustomAudience', async ({ customAudience, update = false }, { rejectWithValue }) => {
  try {
    let response;
    if (update) {
      response = await $api.put<FetchCustomAudienceResponse>(
        `api/posts/audience/${customAudience.id}/update/`,
        {
          ...customAudience,
          audience_list: customAudience.audience_list.map((friend) => friend.id),
        }
      );
      response.data.audience_list = response.data.users_list;
    } else if (customAudience.id > -1) {
      response = await $api.get<IAudience>(`api/posts/audience/${customAudience.id}/details/`);
    } else {
      response = await $api.post<FetchCustomAudienceResponse>('api/posts/audience/', {
        ...customAudience,
        audience_list: customAudience.audience_list.map((friend) => friend.id),
      });
      response.data.audience_list = response.data.users_list;
    }
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(FetchStatusEnum.ERROR);
  }
});

//*=========================================================CUSTOM AUDIENCE DELETE
export const fetchDeleteCustomAudience = createAsyncThunk<
  IAudience,
  { customAudience: IAudience },
  { rejectValue: FetchStatusEnum }
>('posts/fetchDeleteCustomAudience', async ({ customAudience }, { rejectWithValue }) => {
  try {
    const response = await $api.delete<IAudience>(
      `api/posts/audience/${customAudience.id}/delete/`
    );
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(FetchStatusEnum.ERROR);
  }
});

//*=========================================================CUSTOM AUDIENCES LIST
export const fetchCustomAudiencesList = createAsyncThunk<
  IFetchCustomAudiencesList,
  number,
  { rejectValue: FetchStatusEnum }
>('posts/fetchCustomAudiences', async (id, { rejectWithValue }) => {
  try {
    const response = await $api.get<IFetchCustomAudiencesList>(
      'api/posts/audience/' + id + '/list/'
    );
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(FetchStatusEnum.ERROR);
  }
});
