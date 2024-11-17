import { createSlice } from '@reduxjs/toolkit';
import { fetchAuthLogin, fetchAuthRefresh, fetchAuthRegister } from './asyncActions';
import { IAuthState } from './types';
import { EFetchStatus } from '../../types/enums';

const initialState: IAuthState = {
  userId: undefined,
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    //REGISTER
    builder.addCase(fetchAuthRegister.pending, (state) => {
      state.registerStatus = EFetchStatus.PENDING;
    });
    builder.addCase(fetchAuthRegister.fulfilled, (state, action) => {
      state.registerStatus = EFetchStatus.SUCCESS;
      state.errors = undefined;
    });
    builder.addCase(fetchAuthRegister.rejected, (state, action) => {
      state.registerStatus = EFetchStatus.ERROR;
      state.errors = action.payload;
    });
    //LOGIN
    builder.addCase(fetchAuthLogin.pending, (state) => {
      state.loginStatus = EFetchStatus.PENDING;
    });
    builder.addCase(fetchAuthLogin.fulfilled, (state, action) => {
      state.loginStatus = EFetchStatus.SUCCESS;
      state.userId = action.payload;
      state.errors = undefined;
    });
    builder.addCase(fetchAuthLogin.rejected, (state, action) => {
      state.loginStatus = EFetchStatus.ERROR;
      state.userId = undefined;
      state.errors = action.payload;
    });
    //REFRESH
    builder.addCase(fetchAuthRefresh.pending, (state) => {
      state.loginStatus = EFetchStatus.PENDING;
    });
    builder.addCase(fetchAuthRefresh.fulfilled, (state, action) => {
      state.loginStatus = EFetchStatus.SUCCESS;
      state.userId = action.payload;
      state.errors = undefined;
    });
    builder.addCase(fetchAuthRefresh.rejected, (state, action) => {
      state.loginStatus = EFetchStatus.ERROR;
      state.userId = undefined;
      state.errors = action.payload;
    });
  },
});

export const { logOut, setGuestStatus } = authSlice.actions;

export default authSlice.reducer;
