import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from '../../models/IUser';
import { IAuthError, IAuthResponse } from '../../models/response/AuthResonse';
import { API_URL } from '../../utils/consts';
import jwt_decode from 'jwt-decode';

export const fetchAuthLogin = createAsyncThunk<number, Record<string, string>, { rejectValue: IAuthError }>(
  'auth/fetchAuthLogin',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post<IAuthResponse>(API_URL + 'api/token/', params);
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

export const fetchAuthRefresh = createAsyncThunk<number, {}, { rejectValue: IAuthError }>(
  'auth/fetchAuthRefresh',
  async (params, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post<IAuthResponse>(API_URL + 'api/token/refresh/', {
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

export const fetchAuthRegister = createAsyncThunk<{}, Record<string, string>, { rejectValue: IAuthError }>(
  'auth/fetchAuthRegister',
  async (params, { rejectWithValue }) => {
    try {
      await axios.post<{ id: number; username: string }>(API_URL + 'api/register/', params);
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue({ message: error.response.data.detail } as IAuthError);
    }
  }
);
