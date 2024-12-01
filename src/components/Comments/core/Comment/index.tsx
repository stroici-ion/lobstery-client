import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { USER_PROFILE_ROUTE } from '../../../../utils/consts';
import CommentActions from '../CommentActions';
import CommentText from '../ExtensibleText';
import { getTime } from '../../../../utils/getTime';
import Replies from '../Replies';
import styles from './styles.module.scss';
import { EditSvg, PinSvg, ReportSvg, SubmenuSvg } from '../../../../icons';
import DeleteSvg from '../../../../icons/DeleteSvg';
import WriteComment from '../WriteComment';
import { editComment, removeComment, togglePinnedComment } from '../../../../services/comments/CommentsServices';
import { IUser } from '../../../../redux/profile/types';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import UserImage from '../../../UserImage';
import { IComment } from '../../types';
import getUserName from '../../../user/utils/getUserName';
import CommentUserName from '../CommentUserName';
import ctxBtnStyles from '../../../../styles/components/buttons/contextButtons.module.scss';
import ContextMenu from '../../../UI/ContextMenu';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import RippleButton from '../../../UI/buttons/RippleButton';

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
  const user = useSelector(selectUserProfile).user;
  const [isCreateReplyVisible, setIsCreateReplyVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [, setIsEditingCommentLoading] = useState(false);

  const handleToggleCreateReply = () => {
    setIsCreateReplyVisible(!isCreateReplyVisible);
  };

  const likesInfo = {
    liked: comment.liked,
    disliked: comment.disliked,
    likesCount: comment.likesCount,
    dislikesCount: comment.dislikesCount,
    isLikedByAuthor: comment.isLikedByAuthor,
  };

  const handleRemoveComment = async () => {
    // showModal(MODAL_TYPES.DIALOG_MODAL, {
    //   title: 'Are you sure tou want to update comment?',
    //   callBack: async () => {
    toast((t) => (
      <div className={styles.toast}>
        Are you sure you want to delete this comment!
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

  const handleReportComment = async () => {};

  const handleToggleEditComment = () => {
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
          comments.map((item) => (item.id === comment.id ? { ...item, isPinnedByAuthor: true } : item))
        );
        setPinnedComment({ ...comment, isPinnedByAuthor: true });
      } else {
        setComments((comments) =>
          comments.map((item) => (item.id === comment.id ? { ...item, isPinnedByAuthor: false } : item))
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
      <button className={ctxBtnStyles.panel1Orange} onClick={handleToggleEditComment}>
        <EditSvg />
        Edit comment
      </button>
    ),
    deleteButton: (
      <button className={ctxBtnStyles.panel1Red} onClick={handleRemoveComment}>
        <DeleteSvg />
        Delete comment
      </button>
    ),
    reportButton: (
      <button className={ctxBtnStyles.panel1Red} onClick={handleReportComment}>
        <ReportSvg />
        Report comment
      </button>
    ),
    pinButton: (
      <button className={ctxBtnStyles.panel1Orange} onClick={handleTogglePinnedComment}>
        <PinSvg />
        Pin comment
      </button>
    ),
    unpinButton: (
      <button className={ctxBtnStyles.panel1Blue} onClick={handleTogglePinnedComment}>
        <PinSvg />
        Unpin comment
      </button>
    ),
  };

  const ctx = useContextMenu();

  return (
    <>
      {isEditing ? (
        <WriteComment initialValue={comment.text} hide={handleToggleEditComment} sendComment={handleEditComment} />
      ) : (
        <div className={classNames(styles.comment, isPinned && styles.pinned)}>
          {isPinned && (
            <div className={classNames(styles.comment__pinned, wasPinned && styles.comment__wasPinned)}>
              <PinSvg />
              {wasPinned ? 'Was' : 'Is'} pinned by{' '}
              <Link to={USER_PROFILE_ROUTE + '/' + owner.id} className={styles.comment__pinnedOwner}>
                {getUserName(owner)}
              </Link>
            </div>
          )}
          <UserImage user={comment.user} className={styles.comment__avatar} />
          <div className={styles.comment__body}>
            <div className={styles.comment__top}>
              <div className={styles.comment__info}>
                <CommentUserName user={user} postUserId={owner.id} commentUserId={comment.user.id} />
                <span className={styles.comment__timeInfo}>{getTime(comment.createdAt)}</span>
              </div>
              <RippleButton
                className={styles.comment__contextMenuButton}
                triggerRef={ctx.triggerRef}
                onClick={ctx.onShow}
              >
                <SubmenuSvg />
              </RippleButton>
              {ctx.isOpen && (
                <ContextMenu {...ctx}>
                  {comment.user.id === user.id ? (
                    <>
                      {owner.id === user.id &&
                        (comment.isPinnedByAuthor
                          ? commentContextMenuButtons.unpinButton
                          : commentContextMenuButtons.pinButton)}
                      {commentContextMenuButtons.editButton}
                      {commentContextMenuButtons.deleteButton}
                    </>
                  ) : (
                    <>
                      {owner.id === user.id &&
                        (comment.isPinnedByAuthor
                          ? commentContextMenuButtons.unpinButton
                          : commentContextMenuButtons.pinButton)}
                      {commentContextMenuButtons.reportButton}
                      {owner.id === user.id && commentContextMenuButtons.deleteButton}
                    </>
                  )}
                </ContextMenu>
              )}
            </div>
            <CommentText text={comment.text} />
            <CommentActions
              isMultimedia={isMultimedia}
              owner={owner}
              isOwner={user?.id === owner.id}
              id={comment.id}
              className={styles.root__actions}
              handleToggleCreateReply={handleToggleCreateReply}
              likesInfo={likesInfo}
            />
            <Replies
              postId={comment.post}
              isMultimedia={isMultimedia}
              owner={owner}
              isRepliedByAuthor={comment.isRepliedByAuthor}
              isCreateReplyVisible={isCreateReplyVisible}
              setIsCreateReplyVisible={setIsCreateReplyVisible}
              commentId={comment.id}
              repliesCount={comment.repliesCount}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
