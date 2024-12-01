import { RootState } from '..';
import { EFetchStatus } from '../../types/enums';

export const selectUserId = (state: RootState) => state.auth.userId;
export const selectAuthErrors = (state: RootState) => state.auth.errors;
export const selectRegisterStatus = (state: RootState) => state.auth.registerStatus;
export const selectAuthStatus = (state: RootState) => state.auth.loginStatus === EFetchStatus.SUCCESS;
