import { RootState } from '..';

export const selectActiveImage = (state: RootState) => state.images.activeImage;
export const selectImages = (state: RootState) => state.images.images;
export const selectImageEditOperationType = (state: RootState) => state.images.operation;
export const selectActiveImageIndex = (state: RootState) => state.images.activeIndex;
