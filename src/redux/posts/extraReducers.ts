import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { fetchCreatePost, fetchPosts, fetchRemovePost } from './asyncActions';
import { EFetchStatus } from '../../types/enums';
import { IPostsState } from './types';

export const extraReducers = (builder: ActionReducerMapBuilder<IPostsState>) => {
  //* POSTS LIST
  builder.addCase(fetchPosts.pending, (state) => {
    state.status = EFetchStatus.PENDING;
  });
  builder.addCase(fetchPosts.fulfilled, (state, action) => {
    state.status = EFetchStatus.SUCCESS;
    state.posts = action.payload.posts;
    state.count = action.payload.count;
    state.errors = undefined;
  });
  builder.addCase(fetchPosts.rejected, (state, action) => {
    state.status = EFetchStatus.ERROR;
    state.posts = [];
    state.count = 0;
    state.errors = action.payload;
  });

  //* CREATE POST
  builder.addCase(fetchCreatePost.pending, (state) => {
    state.postCreateStatus = EFetchStatus.PENDING;
  });
  builder.addCase(fetchCreatePost.fulfilled, (state, action) => {
    state.postCreateStatus = EFetchStatus.SUCCESS;
    state.posts = [action.payload, ...state.posts.filter((p) => p.id !== action.payload.id)];
    state.count++;
    state.errors = undefined;
  });
  builder.addCase(fetchCreatePost.rejected, (state, action) => {
    state.errors = action.payload;
    state.postCreateStatus = EFetchStatus.ERROR;
  });

  //* REMOVE POST
  builder.addCase(fetchRemovePost.pending, (state) => {
    state.postCreateStatus = EFetchStatus.PENDING;
  });
  builder.addCase(fetchRemovePost.fulfilled, (state, action) => {
    state.posts = state.posts.filter((post) => post.id !== action.payload);
    state.count--;
    state.errors = undefined;
    state.postCreateStatus = EFetchStatus.SUCCESS;
  });
  builder.addCase(fetchRemovePost.rejected, (state, action) => {
    state.errors = action.payload;
    state.postCreateStatus = EFetchStatus.ERROR;
  });
};
