import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IUser } from '../profile/types';
import { extraReducers } from './extraReducers';
import { EImageEditOperations, IImage, IImagesState } from './types';

const initialState: IImagesState = {
  images: [],
  activeImage: undefined,
  operation: EImageEditOperations.TAG,
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
    updatedEditedImage: (state, action: PayloadAction<IImage>) => {
      const image = action.payload;
      state.images = state.images.map((i) => (i.id === image.id ? { ...image, id: Math.random() * -1 } : i));
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
        state.activeImage.taggedFriends = state.activeImage.taggedFriends?.filter(
          (item) => item.user.id !== action.payload
        );
      }
    },
    addImageTaggedFriend: (state, action: PayloadAction<{ user: IUser; top: number; left: number }>) => {
      if (state.activeImage) {
        state.activeImage.isUpdated = true;
        state.activeImage.taggedFriends = [...(state.activeImage.taggedFriends || []), action.payload];
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
    setImageEditOperationType: (state, action: PayloadAction<EImageEditOperations>) => {
      state.operation = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<{ id: number; progress: number }>) => {
      const candidate = state.images.find((image) => image.id === action.payload.id);
      if (candidate) candidate.uploadProgress = action.payload.progress;
    },
    setActiveImage: (state, action: PayloadAction<IImage | undefined>) => {
      state.activeImage = action.payload;
    },
  },
  extraReducers,
});
export const {
  setActiveImageId,
  setImages,
  removeImageTaggedFriend,
  addImageTaggedFriend,
  setImageCaption,
  setActiveImageIndex,
  setImageEditOperationType,
  updatedEditedImage,
  setUploadProgress,
  addImages,
  updateImage,
  setActiveImage,
  removeImage,
} = imagesSlice.actions;

export default imagesSlice.reducer;
