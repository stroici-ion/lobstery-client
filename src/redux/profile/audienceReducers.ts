import { PayloadAction } from '@reduxjs/toolkit';
import { IUser, IUserProfileState } from './types';
import { IAudience } from './audienceTypes';

export const audienceReducers = {
  setDefaultAudience: (state: IUserProfileState, action: PayloadAction<number>) => {
    state.defaultAudience = action.payload;
  },
  setDefaultCustomAudience: (state: IUserProfileState, action: PayloadAction<number>) => {
    state.defaultCustomAudience = action.payload;
  },
  setActiveCustomAudience: (state: IUserProfileState, action: PayloadAction<IAudience>) => {
    state.activeCustomAudience = action.payload;
  },
  setActiveCustomAudienceTitle: (state: IUserProfileState, action: PayloadAction<string>) => {
    state.activeCustomAudience.title = action.payload;
  },
  setActiveCustomAudienceType: (state: IUserProfileState, action: PayloadAction<number>) => {
    state.activeCustomAudience.audience = action.payload;
  },
  addActiveCustomAudienceFriend: (state: IUserProfileState, action: PayloadAction<IUser>) => {
    state.activeCustomAudience.users = [...state.activeCustomAudience.users, action.payload];
  },
  removeActiveCustomAudienceFriend: (state: IUserProfileState, action: PayloadAction<number>) => {
    state.activeCustomAudience.users = state.activeCustomAudience.users.filter((user) => user.id !== action.payload);
  },
};
