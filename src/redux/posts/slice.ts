import { createSlice } from '@reduxjs/toolkit';
import { extraReducers } from './extraReducers';

import { initialState } from './initialState';
import { reducers } from './reducers';

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers,
  extraReducers,
});

export const {
  setActivePost,
  setIsPostFormVisible,
  setTitle,
  setText,
  setAudience,
  setCustomAudience,
  setTags,
  setUploadProgress,
  setFeeling,
  addTaggedFriend,
  removeTaggedFriend,
  setImagesLayout,
  setPost,
} = postsSlice.actions;

export default postsSlice.reducer;
