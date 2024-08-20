import { RootState } from '..';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export const selectUserId = (state: RootState) => state.auth.userId;
export const selectAuthErrors = (state: RootState) => state.auth.errors;
export const selectAuthStatus = (state: RootState) => Boolean(state.auth.userId);
export const selectRegisterStatus = (state: RootState) => state.auth.registerStatus;
