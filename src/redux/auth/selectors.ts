import { RootState } from '..';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export const selectUserId = (state: RootState) => state.auth.userId;
export const selectAuthErrors = (state: RootState) => state.auth.errors;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectRegisterStatus = (state: RootState) => state.auth.registerStatus;
