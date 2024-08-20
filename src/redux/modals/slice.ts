import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IModalsState } from './types';
import { DialogModalEnum } from '../../models/DialogModalEnum';

const initialState: IModalsState = {
  imagesModalStatus: false,
  postCreateModalStatus: false,
  dialogModalStatus: false,
  dialodTitle: '',
  dialogText: '',
  dialogType: DialogModalEnum.OK,
  dialogResponse: false,
};

const modlasSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setImagesModalStatus: (state, action: PayloadAction<boolean>) => {
      state.imagesModalStatus = action.payload;
    },
    setPostCreateModalStatus: (state, action: PayloadAction<boolean>) => {
      state.postCreateModalStatus = action.payload;
    },
    setDialogModalStatus: (
      state,
      action: PayloadAction<{ status: boolean; title: string; text: string }>
    ) => {
      if (action.payload.status) {
        state.dialodTitle = action.payload.title;
        state.dialogText = action.payload.text;
      } else {
        state.dialodTitle = '';
        state.dialogText = '';
      }
      state.postCreateModalStatus = action.payload.status;
    },
  },
});

export const { setImagesModalStatus, setPostCreateModalStatus, setDialogModalStatus } =
  modlasSlice.actions;

export default modlasSlice.reducer;
