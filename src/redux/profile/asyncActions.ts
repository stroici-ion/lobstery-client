import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { IFetchedUser, IUser } from './types';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';
import { IFetchError } from '../auth/types';

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchUserProfile = createAsyncThunk<IUser, number, { rejectValue: IFetchError }>(
  'profile/fetchUserProfile',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get<IFetchedUser>(apiUrl + 'api/profiles/' + params);
      return convertKeysToCamelCase(response.data) as IUser;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IFetchError);
    }
  }
);
