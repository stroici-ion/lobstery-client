import { IUser } from '../../../redux/profile/types';

const getUserAcronyms = (user: IUser) => user.firstName[0] || '' + user.lastName[0] || '';

export default getUserAcronyms;
