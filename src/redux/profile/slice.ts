import { createSlice } from '@reduxjs/toolkit';
import { EFetchStatus } from '../../types/enums';
import { IUser, IUserProfileState } from './types';
import { audienceReducers } from './audienceReducers';
import { audienceExtraReducers } from './audienceExtraReducers';
import { fetchMyProfile, fetchUserProfile } from './asyncActions';
import { fetchFavoritePost, fetchLikePost, fetchPostsByUser } from '../posts/asyncActions';

const initialState: IUserProfileState = {
  user: {
    id: -1,
    firstName: 'Guest',
    lastName: '',
  },
  friends: [],
  friendsCount: 0,
  posts: [],
  images: [],
  defaultAudience: -1,
  defaultCustomAudience: -1,

  users: [],
  userProfileStatus: EFetchStatus.PENDING,

  customAudiencesCount: 0,
  customAudiencesList: [],
  activeCustomAudience: {
    id: -1,
    title: '',
    audience: 0,
    users: [],
  },

  //status
  defaultAudienceStatus: EFetchStatus.PENDING,
  customAudienceStatus: EFetchStatus.PENDING,
  customAudiencesListStatus: EFetchStatus.PENDING,
  status: EFetchStatus.PENDING,
  errors: undefined,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    ...audienceReducers,
  },
  extraReducers: (builder) => {
    audienceExtraReducers(builder);

    builder.addCase(fetchMyProfile.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.defaultAudience = action.payload.defaultAudience;
      state.defaultCustomAudience = action.payload.defaultCustomAudience;
      state.friends = action.payload.friends;
      state.friendsCount = action.payload.friendsCount;
      state.errors = undefined;
      state.status = EFetchStatus.SUCCESS;
    });

    builder.addCase(fetchMyProfile.rejected, (state, action) => {
      state.user = {} as IUser;
      state.defaultAudience = -1;
      state.defaultCustomAudience = -1;
      state.friends = [];
      state.friendsCount = 0;
      state.posts = [];
      state.images = [];
      state.errors = action.payload;
      state.status = EFetchStatus.ERROR;
    });

    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.users.push(action.payload);
      state.errors = undefined;
      state.userProfileStatus = EFetchStatus.SUCCESS;
    });

    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state = initialState;
      state.errors = action.payload;
      state.userProfileStatus = EFetchStatus.ERROR;
    });

    builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
      state.posts = action.payload.posts;
    });

    builder.addCase(fetchLikePost.fulfilled, (state, action) => {
      const candidate = state.posts.find((p) => p.id === action.payload.id);
      if (candidate) {
        const likesInfo = action.payload.likesInfo;
        candidate.likesCount = likesInfo.likesCount;
        candidate.dislikesCount = likesInfo.dislikesCount;
        candidate.liked = likesInfo.liked;
        candidate.disliked = likesInfo.disliked;
      }
    });

    builder.addCase(fetchFavoritePost.fulfilled, (state, action) => {
      const candidate = state.posts.find((p) => p.id === action.payload.id);
      if (candidate) {
        candidate.favorite = action.payload.favorite;
      }
    });
  },
});

export const {
  setDefaultAudience,
  setDefaultCustomAudience,
  setActiveCustomAudience,
  setActiveCustomAudienceTitle,
  setActiveCustomAudienceType,
  addActiveCustomAudienceFriend,
  removeActiveCustomAudienceFriend,
} = profileSlice.actions;

export default profileSlice.reducer;
