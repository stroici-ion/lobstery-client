import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { extraReducres } from './extraReducers';
import { IUser } from '../../models/IUser';
import { IPost } from '../../models/IPost';

import { initialState } from './initialState';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setActivePost: (state, action: PayloadAction<IPost | undefined>) => {
      state.postCreateStatus = FetchStatusEnum.PENDING;
      state.uploadProgress = 0;
      if (action.payload)
        state.activePost = {
          fetched_images_id: action.payload.image_set.filter((image) => image.id >= 0).map((image) => image.id),
          ...action.payload,
        };
      else
        state.activePost = {
          id: -1,
          title: '',
          text: '',
          image_set: [],
          tags: [],
          tagged_friends: [],
          audience: -1,
          custom_audience: -1,
          fetched_images_id: [],
        };

      state.postSnapshot = {
        ...state.activePost,
      };
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.activePost.title = action.payload;
    },
    setText: (state, action: PayloadAction<string>) => {
      state.activePost.text = action.payload;
    },
    setAudience: (state, action: PayloadAction<number>) => {
      state.activePost.audience = action.payload;
    },
    setCustomAudience: (state, action: PayloadAction<number>) => {
      state.activePost.custom_audience = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.activePost.tags = action.payload;
    },
    setFeeling: (state, action: PayloadAction<string | undefined>) => {
      state.activePost.feeling = action.payload;
    },
    addTaggedFriend: (state, action: PayloadAction<IUser>) => {
      state.activePost.tagged_friends = [...state.activePost.tagged_friends, action.payload];
    },
    removeTaggedFriend: (state, action: PayloadAction<number>) => {
      state.activePost.tagged_friends = state.activePost.tagged_friends.filter(
        (tagged_friend) => tagged_friend.id !== action.payload
      );
    },
  },
  extraReducers: extraReducres,
});

export const {
  setActivePost,
  setTitle,
  setText,
  setAudience,
  setCustomAudience,
  setTags,
  setUploadProgress,
  setFeeling,
  addTaggedFriend,
  removeTaggedFriend,
} = postsSlice.actions;

export default postsSlice.reducer;
