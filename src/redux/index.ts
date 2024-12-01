import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import auth from './auth/slice';
import posts from './posts/slice';
import app from './app/slice';
// import audience from './defaultAudience/slice';
import profile from './profile/slice';
import images from './images/slice';
import modlas from './modals/slice';

const store = configureStore({
  reducer: {
    auth,
    posts,
    // audience,
    app,
    profile,
    images,
    modlas,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
