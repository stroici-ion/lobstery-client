import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { IAuthError } from '../../models/auth/IAuthError';
import { IUser } from '../../models/IUser';

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchUserProfile = createAsyncThunk<IUser, number, { rejectValue: IAuthError }>(
  'profile/fetchUserProfile',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get<IUser>(apiUrl + 'api/profiles/' + params);
      return response.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IAuthError);
    }
  }
);
