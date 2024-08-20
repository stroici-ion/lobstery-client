import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from '../../models/IUser';
import { IAuthError } from '../../models/response/AuthResonse';
import { API_URL } from '../../utils/consts';

export const fetchUserProfile = createAsyncThunk<IUser, number, { rejectValue: IAuthError }>(
  'profile/fetchUserProfile',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get<IUser>(API_URL + 'api/profiles/' + params);
      return response.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IAuthError);
    }
  }
);
