import { IUser } from '../../../redux/profile/types';

const getUserName = (user: IUser) => `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`;

export default getUserName;
