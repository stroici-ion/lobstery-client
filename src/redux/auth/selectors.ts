import { RootState } from '..';

export const selectUserId = (state: RootState) => state.auth.userId;
export const selectAuthErrors = (state: RootState) => state.auth.errors;
export const selectRegisterStatus = (state: RootState) => state.auth.registerStatus;

export const selectAuthStatus = (state: RootState) => state.auth;
