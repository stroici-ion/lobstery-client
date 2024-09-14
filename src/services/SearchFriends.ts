import $api from '../http';
import { IUser } from '../models/IUser';

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchFriends = async (id: number, username: string) => {
  return await $api.get<{ friends: { user: IUser }[] }>(apiUrl + `/api/profiles/friends/${id}/`);
};
