import { RootState } from '..';

export const selectImagesModalStatus = (state: RootState) => state.modlas.imagesModalStatus;
export const selectPostCreateModalStatus = (state: RootState) => state.modlas.postCreateModalStatus;
export const selectDialogModalStatus = (state: RootState) => state.modlas.dialogModalStatus;
export const selectDialodTitle = (state: RootState) => state.modlas.dialodTitle;
export const selectDialogText = (state: RootState) => state.modlas.dialogText;
export const selectDialogType = (state: RootState) => state.modlas.dialogType;
export const selectDialogResponse = (state: RootState) => state.modlas.dialogResponse;
