import $api from '../../http';
import { IFetchedUser, IUser } from '../../redux/profile/types';
import convertKeysToCamelCase from '../../utils/convertKeysToCamelCase';

export interface IFetchedFriends {
  friends: {
    user: IFetchedUser;
  }[];
}

export const fetchFriends = async (id: number, username: string) => {
  const response = await $api.get<IFetchedFriends>(`api/profiles/friends/${id}/`);
  return convertKeysToCamelCase(response.data.friends.map((f) => f.user)) as IUser[];
};
