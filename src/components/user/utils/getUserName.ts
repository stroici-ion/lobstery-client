import { IUser } from '../../../models/IUser';

const getUserName = (user: IUser) => (user.first_name + user.last_name ? ` ${user.last_name}` : '');

export default getUserName;
