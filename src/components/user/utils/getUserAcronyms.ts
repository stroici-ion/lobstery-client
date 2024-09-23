import { IUser } from '../../../models/IUser';

const getUserAcronyms = (user: IUser) => user.first_name[0] || '' + user.last_name[0] || '';

export default getUserAcronyms;
