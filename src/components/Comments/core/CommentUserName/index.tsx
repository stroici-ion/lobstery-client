import classNames from 'classnames';

import styles from './styles.module.scss';
import { IUser } from '../../../../redux/profile/types';
import getUserName from '../../../user/utils/getUserName';
import { TbCrown } from 'react-icons/tb';

interface ICommentUserName {
  commentUserId: number;
  postUserId: number;
  user: IUser;
}

const CommentUserName: React.FC<ICommentUserName> = ({ commentUserId, postUserId, user }) => {
  return (
    <div className={classNames(styles.userName)}>
      {getUserName(user)}
      {commentUserId === postUserId && (
        <span className={styles.userName__owner}>
          <TbCrown />
        </span>
      )}
    </div>
  );
};

export default CommentUserName;
