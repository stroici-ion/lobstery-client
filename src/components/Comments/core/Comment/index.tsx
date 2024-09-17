import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { USER_PROFILE_ROUTE } from '../../../../utils/consts';
import CommentActions from '../CommentActions';
import CommentText from '../CommentText';
import { getTime } from '../../../../utils/getTime';
import Replies from '../Replies';
import styles from './styles.module.scss';
import { EditSvg, PinSvg, ReportSvg } from '../../../../icons';
import DeleteSvg from '../../../../icons/DeleteSvg';
import WriteComment from '../WriteComment';
import { editComment, removeComment, togglePinnedComment } from '../../../../services/CommentsServices';
import CommentContextMenu from '../CommentContextMenu';
import { Link } from 'react-router-dom';
import { IUser } from '../../../../models/IUser';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import { IComment } from '../../../../models/comments/IComment';
import UserImage from '../../../UserImage';
import toast from 'react-hot-toast';

interface ICommentFC {
  isPinned?: boolean;
  wasPinned?: boolean;
  setPinnedComment: React.Dispatch<React.SetStateAction<IComment | undefined>>;
  comment: IComment;
  owner: IUser;
  postId: number;
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
  isMultimedia: boolean;
}

const Comment: React.FC<ICommentFC> = ({
  isPinned = false,
  wasPinned = false,
  comment,
  postId,
  owner,
  setPinnedComment,
  setComments,
  isMultimedia,
}) => {
  const user = useSelector(selectUserProfile);
  const [isCreateReplyVisible, setIsCreateReplyVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCommentLoading, setIsEditingCommentLoading] = useState(false);

  const handleToggleCreateRelpy = () => {
    setIsCreateReplyVisible(!isCreateReplyVisible);
  };

  const likesInfo = {
    liked: comment.liked,
    disliked: comment.disliked,
    likes_count: comment.likes_count,
    dislikes_count: comment.dislikes_count,
    liked_by_author: comment.liked_by_author,
  };

  const handleRemoveComment = async () => {
    // showModal(MODAL_TYPES.DIALOG_MODAL, {
    //   title: 'Are you sure tou want to update comment?',
    //   callBack: async () => {
    toast((t) => (
      <div className={styles.toast}>
        Are you sure you want to delete this commet!
        <div className={styles.toast__row}>
          <button
            className={styles.toast__yes}
            onClick={async () => {
              setIsEditingCommentLoading(true);
              const removed = await removeComment(comment.id);
              if (removed) {
                setComments((comments) => comments.filter((item) => item.id !== comment.id));
              }
              setIsEditingCommentLoading(false);
              setIsEditing(false);
              toast.dismiss(t.id);
            }}
          >
            Yes
          </button>
          <button className={styles.toast__no} onClick={() => toast.dismiss(t.id)}>
            No
          </button>
        </div>
      </div>
    ));

    //   },
    // });
  };

  const handeReportComment = async () => {};

  const handleToogleEditComment = () => {
    setIsEditing(!isEditing);
  };

  const handleTogglePinnedComment = async () => {
    // showModal(MODAL_TYPES.DIALOG_MODAL, {
    //   title: 'Are you sure tou want to update pinned comment?',
    //   callBack: async () => {
    const result = await togglePinnedComment(postId, comment.id);

    if (result) {
      if (result.pinned_comment === comment.id) {
        setComments((comments) =>
          comments.map((item) => (item.id === comment.id ? { ...item, is_pinned_by_author: true } : item))
        );
        setPinnedComment({ ...comment, is_pinned_by_author: true });
      } else {
        setComments((comments) =>
          comments.map((item) => (item.id === comment.id ? { ...item, is_pinned_by_author: false } : item))
        );
        setPinnedComment(undefined);
      }
    }
    //   },
    // });
  };

  const handleEditComment = async (value: string) => {
    // showModal(MODAL_TYPES.DIALOG_MODAL, {
    //   title: 'Are you sure tou want to update comment?',
    //   callBack: async () => {
    setIsEditingCommentLoading(true);
    const newComment = await editComment(comment.id, value);
    if (newComment) {
      setComments((comments) => comments.map((item) => (item.id === comment.id ? { ...item, text: value } : item)));
    }
    setIsEditingCommentLoading(false);
    setIsEditing(false);
    //   },
    // });
  };

  const commentContextMenuButtons = {
    editButton: (
      <button className={styles.submenu__edit} onClick={handleToogleEditComment}>
        <EditSvg />
        Edit comment
      </button>
    ),
    deleteButton: (
      <button className={styles.submenu__delete} onClick={handleRemoveComment}>
        <DeleteSvg />
        Delete comment
      </button>
    ),
    reportButton: (
      <button className={styles.submenu__report} onClick={handeReportComment}>
        <ReportSvg />
        Report comment
      </button>
    ),
    pinButton: (
      <button className={styles.submenu__pin} onClick={handleTogglePinnedComment}>
        <PinSvg />
        Pin comment
      </button>
    ),
    unpinButton: (
      <button className={styles.submenu__unpin} onClick={handleTogglePinnedComment}>
        <PinSvg />
        Unpin comment
      </button>
    ),
  };

  return (
    <>
      {isEditing ? (
        <WriteComment initialValue={comment.text} hide={handleToogleEditComment} sendComment={handleEditComment} />
      ) : (
        <div className={classNames(styles.comment, isPinned && styles.pinned)}>
          {isPinned && (
            <div className={classNames(styles.comment__pinned, wasPinned && styles.comment__wasPinned)}>
              <PinSvg />
              {wasPinned ? 'Was' : 'Is'} pinned by{' '}
              <Link to={USER_PROFILE_ROUTE + '/' + owner.id} className={styles.comment__pinned_owner}>
                {`${owner.first_name} ${owner.last_name}`}
              </Link>
            </div>
          )}
          <UserImage user={comment.user} className={styles.comment__avatar} />
          <div className={styles.comment__body}>
            <div className={styles.comment__top}>
              <div className={styles.comment__info}>
                <p
                  className={classNames(
                    styles.comment__nameInfo,
                    comment.user.id === owner.id && styles.comment__nameInfo_owner
                  )}
                >
                  {`${comment.user.first_name} ${comment.user.last_name}`}
                </p>
                <span className={styles.comment__timeInfo}>{getTime(comment.created_at)}</span>
              </div>
              <CommentContextMenu
                isPinnedByAuthor={comment.is_pinned_by_author}
                ownerId={owner.id}
                commentOwnerId={comment.user.id}
                className={styles.submenu}
                buttons={commentContextMenuButtons}
              />
            </div>
            <CommentText text={comment.text} />
            <CommentActions
              isMultimedia={isMultimedia}
              owner={owner}
              isOwner={user?.id === owner.id}
              id={comment.id}
              className={styles.root__actions}
              handleToggleCreateRelpy={handleToggleCreateRelpy}
              likesInfo={likesInfo}
            />
            <Replies
              postId={comment.post}
              isMultimedia={isMultimedia}
              owner={owner}
              isRepliedByAuthor={comment.is_replied_by_author}
              isCreateReplyVisible={isCreateReplyVisible}
              setIsCreateReplyVisible={setIsCreateReplyVisible}
              commentId={comment.id}
              repliesCount={comment.replies_count}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
