import { IUser } from '../../../models/IUser';

const getUserName = (user: IUser) => (user.firstName + user.lastName ? ` ${user.lastName}` : '');

export default getUserName;
