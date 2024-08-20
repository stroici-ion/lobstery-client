export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  profile: {
    avatar: string;
    avatar_thumbnail: string;
    cover: string;
  };
}
