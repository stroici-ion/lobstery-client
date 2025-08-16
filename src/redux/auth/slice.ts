import { createSlice } from '@reduxjs/toolkit';
import { fetchAuthLogin, fetchAuthRegister } from './asyncActions';
import { IAuthState } from './types';
import { EFetchStatus } from '../../types/enums';
import { fetchMe } from '../profile/asyncActions';

const initialState: IAuthState = {
  userId: undefined,
  loading: true,

  loginStatus: EFetchStatus.PENDING,
  registerStatus: EFetchStatus.PENDING,
  errors: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      state.errors = undefined;
      state.userId = undefined;
      state.loginStatus = EFetchStatus.PENDING;
      state.registerStatus = EFetchStatus.PENDING;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setGuestStatus: (state) => {
      state.userId = undefined;
      state.loginStatus = EFetchStatus.ERROR;
      state.loading = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    //REGISTER
    builder.addCase(fetchAuthRegister.pending, (state) => {
      state.loading = true;
      state.registerStatus = EFetchStatus.PENDING;
    });
    builder.addCase(fetchAuthRegister.fulfilled, (state, action) => {
      state.errors = undefined;
      state.registerStatus = EFetchStatus.SUCCESS;
      state.loading = false;
    });
    builder.addCase(fetchAuthRegister.rejected, (state, action) => {
      state.errors = action.payload;
      state.registerStatus = EFetchStatus.ERROR;
      state.loading = false;
    });
    //LOGIN
    builder.addCase(fetchAuthLogin.pending, (state) => {
      state.loading = true;
      state.loginStatus = EFetchStatus.PENDING;
    });
    builder.addCase(fetchAuthLogin.fulfilled, (state, action) => {
      state.userId = action.payload;
      state.errors = undefined;
      state.loginStatus = EFetchStatus.SUCCESS;
      state.loading = false;
    });
    builder.addCase(fetchAuthLogin.rejected, (state, action) => {
      state.userId = undefined;
      state.errors = action.payload;
      state.loginStatus = EFetchStatus.ERROR;
      state.loading = false;
    });

    //ME
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.userId = action.payload.user.id;
      state.errors = undefined;
      state.loginStatus = EFetchStatus.SUCCESS;
      state.loading = false;
    });
  },
});

export const { logOut, setGuestStatus } = authSlice.actions;

export default authSlice.reducer;
