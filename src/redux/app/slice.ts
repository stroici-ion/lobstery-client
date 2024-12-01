import { createSlice } from '@reduxjs/toolkit';

import { IAppState } from './types';

const initialState: IAppState = {
  isModalOpen: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
});

export const {} = appSlice.actions;

export default appSlice.reducer;
