import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IImagesState } from './types';
import { IImage } from '../../models/IImage';
import { IUser } from '../../models/IUser';
import { ImageEditOperationsEnum } from '../../models/ImageEditOperationsEnum';
import { extraReducres } from './extraReducers';

const initialState: IImagesState = {
  images: [],
  activeImage: undefined,
  operation: ImageEditOperationsEnum.TAG,
  activeIndex: -1,
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<IImage[]>) => {
      state.images = action.payload;
    },
    addImages: (state, action: PayloadAction<IImage[]>) => {
      state.images = state.images.filter((image) => action.payload.find((i) => i.id !== image.id));
      state.images = [...state.images, ...action.payload];
    },
    updateImage: (state, action: PayloadAction<IImage>) => {
      const x = state.images.map((i) => (i.id === action.payload.id ? action.payload : i));
      state.images = x;
    },
    removeImage: (state, action: PayloadAction<IImage>) => {
      state.images = state.images.filter((image) => image.id !== action.payload.id);
    },
    setActiveImageId: (state, action: PayloadAction<number | undefined>) => {
      state.activeImage = state.images.find((image) => image.id === action.payload);
      state.activeIndex = state.images.findIndex((image) => image.id === action.payload);
    },
    removeImageTaggedFriend: (state, action: PayloadAction<number>) => {
      if (state.activeImage) {
        state.activeImage.isUpdated = true;
        state.activeImage.tagged_friends = state.activeImage.tagged_friends?.filter(
          (item) => item.user.id !== action.payload
        );
      }
    },
    addImageTaggedFriend: (state, action: PayloadAction<{ user: IUser; top: number; left: number }>) => {
      if (state.activeImage) {
        state.activeImage.isUpdated = true;
        state.activeImage.tagged_friends = [...(state.activeImage.tagged_friends || []), action.payload];
      }
    },
    setImageCaption: (state, action: PayloadAction<string>) => {
      if (state.activeImage) {
        if (state.activeImage) {
          state.activeImage.isUpdated = true;
          state.activeImage.caption = action.payload;
        }
      }
    },
    setActiveImageIndex: (state, action: PayloadAction<number>) => {
      if (state.activeImage) {
        state.images[state.activeIndex] = state.activeImage;
        state.activeIndex = action.payload;
        if (action.payload >= 0) state.activeImage = state.images[action.payload];
      }
    },
    setImageEditOperationType: (state, action: PayloadAction<ImageEditOperationsEnum>) => {
      state.operation = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<{ id: number; progress: number }>) => {
      const candidate = state.images.find((image) => image.id === action.payload.id);
      if (candidate) candidate.upload_progress = action.payload.progress;
    },
    setActiveImage: (state, action: PayloadAction<IImage | undefined>) => {
      state.activeImage = action.payload;
    },
  },
  extraReducers: extraReducres,
});
export const {
  setActiveImageId,
  setImages,
  removeImageTaggedFriend,
  addImageTaggedFriend,
  setImageCaption,
  setActiveImageIndex,
  setImageEditOperationType,
  setUploadProgress,
  addImages,
  updateImage,
  setActiveImage,
  removeImage,
} = imagesSlice.actions;

export default imagesSlice.reducer;
