import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { fetchCreateImage, fetchRemoveImage, fetchUpdateImage } from './asyncActions';
import { IImage, IImagesState } from './types';

export const extraReducers = (builder: ActionReducerMapBuilder<IImagesState>) => {
  builder.addCase(fetchCreateImage.fulfilled, (state, action: PayloadAction<IImage>) => {});
  builder.addCase(fetchUpdateImage.fulfilled, (state, action: PayloadAction<IImage>) => {});
  builder.addCase(fetchRemoveImage.fulfilled, (state, action: PayloadAction<number>) => {
    state.images = state.images.filter((image) => image.id !== action.payload);
  });
};
