import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAppState } from './types';

const initialState: IAppState = {
  isModalOpen: false,
  isPrimaryMenuCollapsed: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPrimaryMenuCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isPrimaryMenuCollapsed = action.payload;
    },
  },
});

export const { setPrimaryMenuCollapsed } = appSlice.actions;

export default appSlice.reducer;
