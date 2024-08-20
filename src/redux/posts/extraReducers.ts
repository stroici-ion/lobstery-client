import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { fetchCreatePost, fetchPosts, fetchRemovePost } from './asyncActions';
import { FetchStatusEnum } from '../../models/response/FetchStatus';
import { IPostsState } from './types';

export const extraReducres = (builder: ActionReducerMapBuilder<IPostsState>) => {
  //* POSTS LIST
  builder.addCase(fetchPosts.pending, (state) => {
    state.status = FetchStatusEnum.PENDING;
  });
  builder.addCase(fetchPosts.fulfilled, (state, action) => {
    state.status = FetchStatusEnum.SUCCESS;
    state.posts = action.payload.results;
    state.count = action.payload.count;
    state.errors = undefined;
  });
  builder.addCase(fetchPosts.rejected, (state, action) => {
    state.status = FetchStatusEnum.ERROR;
    state.posts = [];
    state.count = 0;
    state.errors = action.payload;
  });

  //* CREATE POST
  builder.addCase(fetchCreatePost.pending, (state) => {
    state.status = FetchStatusEnum.PENDING;
  });
  builder.addCase(fetchCreatePost.fulfilled, (state, action) => {
    state.status = FetchStatusEnum.SUCCESS;
    state.posts = [action.payload, ...state.posts];
    state.count++;
    state.errors = undefined;
  });
  builder.addCase(fetchCreatePost.rejected, (state, action) => {
    state.status = FetchStatusEnum.ERROR;
    state.errors = action.payload;
  });

  //* REMOVE POST
  builder.addCase(fetchRemovePost.pending, (state) => {
    state.status = FetchStatusEnum.PENDING;
  });
  builder.addCase(fetchRemovePost.fulfilled, (state, action) => {
    state.posts = state.posts.filter((post) => post.id !== action.payload);
    state.count--;
    state.errors = undefined;
    state.status = FetchStatusEnum.SUCCESS;
  });
  builder.addCase(fetchRemovePost.rejected, (state, action) => {
    state.errors = action.payload;
    state.status = FetchStatusEnum.ERROR;
  });
};
