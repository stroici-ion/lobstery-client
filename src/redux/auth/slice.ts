import { createSlice } from '@reduxjs/toolkit';
import { FetchStatusEnum } from '../../models/response/FetchStatus';
import { fetchAuthLogin, fetchAuthRefresh, fetchAuthRegister } from './asyncActions';
import { IAuthState } from './types';

const initialState: IAuthState = {
  userId: undefined,
  status: FetchStatusEnum.PENDING,
  registerStatus: FetchStatusEnum.PENDING,
  errors: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      state.errors = undefined;
      state.userId = undefined;
      state.status = FetchStatusEnum.PENDING;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    //REGISTER
    builder.addCase(fetchAuthRegister.pending, (state) => {
      state.registerStatus = FetchStatusEnum.PENDING;
    });
    builder.addCase(fetchAuthRegister.fulfilled, (state) => {
      state.registerStatus = FetchStatusEnum.SUCCESS;
      state.errors = undefined;
    });
    builder.addCase(fetchAuthRegister.rejected, (state, action) => {
      state.registerStatus = FetchStatusEnum.ERROR;
      state.errors = action.payload;
    });
    //LOGIN
    builder.addCase(fetchAuthLogin.pending, (state) => {
      state.status = FetchStatusEnum.PENDING;
    });
    builder.addCase(fetchAuthLogin.fulfilled, (state, action) => {
      state.status = FetchStatusEnum.SUCCESS;
      state.userId = action.payload;
      state.errors = undefined;
    });
    builder.addCase(fetchAuthLogin.rejected, (state, action) => {
      state.status = FetchStatusEnum.ERROR;
      state.userId = undefined;
      state.errors = action.payload;
    });
    //REFRESH
    builder.addCase(fetchAuthRefresh.pending, (state) => {
      state.status = FetchStatusEnum.PENDING;
    });
    builder.addCase(fetchAuthRefresh.fulfilled, (state, action) => {
      state.status = FetchStatusEnum.SUCCESS;
      state.userId = action.payload;
      state.errors = undefined;
    });
    builder.addCase(fetchAuthRefresh.rejected, (state, action) => {
      state.status = FetchStatusEnum.ERROR;
      state.userId = undefined;
      state.errors = action.payload;
    });
  },
});

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
