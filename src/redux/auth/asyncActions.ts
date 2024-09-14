import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { IAuthError } from '../../models/auth/IAuthError';
import { IAuthResponse } from '../../models/auth/AuthResonse';
const apiUrl = process.env.REACT_APP_API_URL;

export const fetchAuthLogin = createAsyncThunk<number, Record<string, string>, { rejectValue: IAuthError }>(
  'auth/fetchAuthLogin',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post<IAuthResponse>(apiUrl + 'api/token/', params);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      const decoded: any = jwt_decode(response.data.access);
      return decoded.user_id;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IAuthError);
    }
  }
);

export const fetchAuthRegister = createAsyncThunk<{}, Record<string, string>, { rejectValue: IAuthError }>(
  'auth/fetchAuthRegister',
  async (params, { rejectWithValue }) => {
    try {
      await axios.post<IAuthResponse>(apiUrl + 'api/register/', params);
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue({
        message: error.response.data.detail || '',
        errors: error.response.data,
      } as IAuthError);
    }
  }
);

export const fetchAuthRefresh = createAsyncThunk<number, {}, { rejectValue: IAuthError }>(
  'auth/fetchAuthRefresh',
  async (params, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post<IAuthResponse>(apiUrl + 'api/token/refresh/', {
        refresh: refreshToken,
      });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      const decoded: any = jwt_decode(response.data.access);
      return decoded.user_id;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ message: error.response.data.detail } as IAuthError);
    }
  }
);
