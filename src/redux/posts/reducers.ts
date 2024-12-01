import { PayloadAction } from '@reduxjs/toolkit';
import { EFetchStatus } from '../../types/enums';
import { IUser } from '../profile/types';
import { initialState } from './initialState';
import { TGridCell } from '../../components/media/ImageGrid/types';
import { IPost, IPostsState } from './types';

export const reducers = {
  setPost: (state: IPostsState, action: PayloadAction<IPost>) => {
    state.posts = state.posts.map((p) => (p.id === action.payload.id ? action.payload : p));
  },
  setActivePost: (state: IPostsState, action: PayloadAction<IPost | undefined>) => {
    state.postCreateStatus = EFetchStatus.PENDING;
    state.uploadProgress = 0;
    if (action.payload)
      state.activePost = {
        fetchedImagesId: action.payload.imageSet.filter((image) => image.id >= 0).map((image) => image.id),
        ...action.payload,
      };
    else state.activePost = initialState.activePost;

    state.postSnapshot = initialState.activePost;
  },
  setUploadProgress: (state: IPostsState, action: PayloadAction<number>) => {
    state.uploadProgress = action.payload;
  },
  setTitle: (state: IPostsState, action: PayloadAction<string>) => {
    state.activePost.title = action.payload;
  },
  setText: (state: IPostsState, action: PayloadAction<string>) => {
    state.activePost.text = action.payload;
  },
  setAudience: (state: IPostsState, action: PayloadAction<{ audience: number; customAudience?: number }>) => {
    state.activePost.audience = action.payload.audience;
    if (action.payload.audience === 4 && action.payload.customAudience)
      state.activePost.customAudience = action.payload.customAudience;
  },
  setCustomAudience: (state: IPostsState, action: PayloadAction<number>) => {
    state.activePost.customAudience = action.payload;
  },
  setTags: (state: IPostsState, action: PayloadAction<string[]>) => {
    state.activePost.tags = action.payload;
  },
  setImagesLayout: (state: IPostsState, action: PayloadAction<TGridCell | undefined>) => {
    state.activePost.imagesLayout = action.payload;
  },
  setFeeling: (state: IPostsState, action: PayloadAction<string | undefined>) => {
    state.activePost.feeling = action.payload;
  },
  addTaggedFriend: (state: IPostsState, action: PayloadAction<IUser>) => {
    state.activePost.taggedFriends = [...state.activePost.taggedFriends, action.payload];
  },
  removeTaggedFriend: (state: IPostsState, action: PayloadAction<number>) => {
    state.activePost.taggedFriends = state.activePost.taggedFriends.filter((f) => f.id !== action.payload);
  },
};
