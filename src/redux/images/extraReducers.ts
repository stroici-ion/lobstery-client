import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';
import { fetchCreateImage, fetchRemoveImage, fetchUpdateImage } from './asyncActions';
import { IImagesState } from './types';
import { IImage } from '../../models/images/IImage';

export const extraReducers = (builder: ActionReducerMapBuilder<IImagesState>) => {
  builder.addCase(fetchCreateImage.fulfilled, (state, action: PayloadAction<IImage>) => {
    let candidate = state.images.find((image) => image.id === action.payload.id);
    if (candidate) candidate = action.payload;
    else state.images = [action.payload, ...state.images];
  });
  builder.addCase(fetchUpdateImage.fulfilled, (state, action: PayloadAction<IImage>) => {
    let candidate = state.images.find((image) => image.id === action.payload.id);
    if (candidate) candidate = action.payload;
    else state.images = [action.payload, ...state.images];
  });
  builder.addCase(fetchRemoveImage.fulfilled, (state, action: PayloadAction<number>) => {
    state.images = state.images.filter((image) => image.id !== action.payload);
  });
};
