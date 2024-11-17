import { createSlice } from '@reduxjs/toolkit';
import { IUser } from './types';
import { EFetchStatus } from '../../types/enums';
import { fetchUserProfile } from './asyncActions';
import { IUserProfileState } from './types';

const initialState: IUserProfileState = {
  user: {} as IUser,
  status: EFetchStatus.PENDING,
  errors: undefined,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //LOGIN
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.status = EFetchStatus.PENDING;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.status = EFetchStatus.SUCCESS;
      state.user = action.payload;
      state.errors = undefined;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.status = EFetchStatus.ERROR;
      state.user = {} as IUser;
      state.errors = action.payload;
    });
  },
});

export default profileSlice.reducer;
