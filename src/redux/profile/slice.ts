import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../models/IUser';
import { FetchStatusEnum } from '../../models/response/FetchStatus';
import { fetchUserProfile } from './asyncActions';
import { IUserProfileState } from './types';

const initialState: IUserProfileState = {
  user: {} as IUser,
  status: FetchStatusEnum.PENDING,
  errors: undefined,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //LOGIN
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.status = FetchStatusEnum.PENDING;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.status = FetchStatusEnum.SUCCESS;
      state.user = action.payload;
      state.errors = undefined;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.status = FetchStatusEnum.ERROR;
      state.user = {} as IUser;
      state.errors = action.payload;
    });
  },
});

export default profileSlice.reducer;
