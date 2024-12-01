import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import {
  fetchCreatePost,
  fetchFavoritePost,
  fetchLikePost,
  fetchPosts,
  fetchPostsByUser,
  fetchRemovePost,
} from './asyncActions';
import { EFetchStatus } from '../../types/enums';
import { IPostsState } from './types';
import { fetchMyProfile } from '../profile/asyncActions';

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
};
