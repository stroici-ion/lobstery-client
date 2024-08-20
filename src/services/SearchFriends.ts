import $api from '../http';
import { IUser } from '../models/IUser';
import { API_URL } from '../utils/consts';

export const fetchFriends = async (id: number, username: string) => {
  return await $api.get<{ friends: { user: IUser }[] }>(API_URL + `/api/profiles/friends/${id}/`);
};
