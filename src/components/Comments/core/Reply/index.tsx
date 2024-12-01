import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { createReply, editComment, removeComment } from '../../../../services/comments/CommentsServices';
import { getTime } from '../../../../utils/getTime';
import CommentActions from '../CommentActions';
import ExtensibleText from '../ExtensibleText';
import WriteComment from '../WriteComment';
import styles from './styles.module.scss';
import { EditSvg, ReportSvg, SubmenuSvg } from '../../../../icons';
import DeleteSvg from '../../../../icons/DeleteSvg';
import { IUser } from '../../../../redux/profile/types';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import Loader from '../../../Loader';
import UserImage from '../../../UserImage';
import { IReply } from '../../types';
import { ILikesInfo } from '../../../../types/LikesInfo.types';
import ctxBtnStyles from '../../../../styles/components/buttons/contextButtons.module.scss';
import CommentUserName from '../CommentUserName';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import ContextMenu from '../../../UI/ContextMenu';
import RippleButton from '../../../UI/buttons/RippleButton';

interface IReplyFC {
  isMultimedia: boolean;
  owner: IUser;
  reply: IReply;
  commentId: number;
  setRecentReplies: React.Dispatch<React.SetStateAction<IReply[]>>;
  setFetchedReplies?: React.Dispatch<React.SetStateAction<IReply[]>>;
  postId: number;
}

const Reply: React.FC<IReplyFC> = ({
  isMultimedia,
  owner,
  postId,
  reply,
  commentId,
  setRecentReplies,
  setFetchedReplies,
}) => {
  const user = useSelector(selectUserProfile).user;
  const [isCreateReplyVisible, setIsCreateReplyVisible] = useState(false);
  const [isCreateReplyLoading, setIsCreateReplyLoading] = useState(false);
  const [, setIsEditingReplyLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateReply = async (text: string) => {
    if (user) {
      setIsCreateReplyLoading(true);
      const mentionedUser = reply.user.id !== user.id ? reply.user.id : undefined;
      const newReply = await createReply(postId, commentId, text, mentionedUser);

      if (newReply) setRecentReplies((recentReplies) => [...recentReplies, newReply]);
      setIsCreateReplyLoading(false);
      setIsCreateReplyVisible(false);
    }
  };

  const handleToggleCreateReply = () => {
    setIsCreateReplyVisible(!isCreateReplyVisible);
  };

  const likesInfo = {
    liked: reply.liked,
    disliked: reply.disliked,
    likesCount: reply.likesCount,
    dislikesCount: reply.dislikesCount,
    isLikedByAuthor: reply.isLikedByAuthor,
  };

  const setLikesInfo = (
    fetchedLikesInfo: ILikesInfo & {
      isLikedByAuthor: boolean;
    }
  ) => {
    if (setFetchedReplies) {
      setFetchedReplies((fetchedReplies) =>
        fetchedReplies.map((item) => (item.id === reply.id ? { ...reply, ...fetchedLikesInfo } : item))
      );
      return;
    }
    setRecentReplies((recentReplies) =>
      recentReplies.map((item) => (item.id === reply.id ? { ...reply, ...fetchedLikesInfo } : item))
    );
  };

  const handleRemoveReply = async () => {
    // showModal(MODAL_TYPES.DIALOG_MODAL, {
    //   title: 'Are you sure tou want to update comment?',
    //   callBack: async () => {
    setIsEditingReplyLoading(true);
    const result = await removeComment(reply.id);
    if (result) {
      if (setFetchedReplies) {
        setFetchedReplies((replies) => replies.filter((item) => item.id !== reply.id));
      } else {
        setRecentReplies((replies) => replies.filter((item) => item.id !== reply.id));
      }
    }
    setIsEditingReplyLoading(false);
    setIsEditing(false);
    //   },
    // });
  };

  const handleToogleEditReply = () => {
    setIsEditing(!isEditing);
  };

  const handleEditReply = async (value: string) => {
    // showModal(MODAL_TYPES.DIALOG_MODAL, {
    //   title: 'Are you sure tou want to update comment?',
    //   callBack: async () => {
    setIsEditingReplyLoading(true);
    const updatedReply = await editComment(reply.id, value);
    if (updatedReply) {
      if (setFetchedReplies) {
        setFetchedReplies((replies) => replies.map((item) => (item.id === reply.id ? { ...item, text: value } : item)));
      } else {
        setRecentReplies((replies) => replies.map((item) => (item.id === reply.id ? { ...item, text: value } : item)));
      }
    }
    setIsEditingReplyLoading(false);
    setIsEditing(false);
    //   },
    // });
  };

  const replyContextMenuButtons = {
    editButton: (
      <button className={ctxBtnStyles.panel1Orange} onClick={handleToogleEditReply}>
        <EditSvg />
        Edit reply
      </button>
    ),
    deleteButton: (
      <button className={ctxBtnStyles.panel1Red} onClick={handleRemoveReply}>
        <DeleteSvg />
        Delete reply
      </button>
    ),
    reportButton: (
      <button className={ctxBtnStyles.panel1Red} onClick={handleRemoveReply}>
        <ReportSvg />
        Report reply
      </button>
    ),
  };
  const ctx = useContextMenu();
  return (
    <>
      {isEditing ? (
        <WriteComment isReply={true} hide={handleToogleEditReply} sendComment={handleEditReply} />
      ) : (
        <div className={styles.comment}>
          <UserImage user={reply.user} className={styles.comment__avatar} />
          <div className={styles.comment__body}>
            <div className={styles.comment__top}>
              <div className={styles.comment__info}>
                <CommentUserName user={user} postUserId={owner.id} commentUserId={reply.user.id} />
                <span className={styles.comment__timeInfo}>{getTime(reply.createdAt)}</span>
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
                  {reply.user.id === user.id ? (
                    <>
                      {replyContextMenuButtons.editButton}
                      {replyContextMenuButtons.deleteButton}
                    </>
                  ) : (
                    <>
                      {replyContextMenuButtons.reportButton}
                      {owner.id === user.id && replyContextMenuButtons.deleteButton}
                    </>
                  )}
                </ContextMenu>
              )}
            </div>
            <ExtensibleText className={styles.comment__text} mentionedUser={reply.mentionedUser} text={reply.text} />
            <CommentActions
              isMultimedia={isMultimedia}
              owner={owner}
              isOwner={user?.id === owner.id}
              isReply={true}
              id={reply.id}
              className={styles.root__actions}
              handleToggleCreateReply={handleToggleCreateReply}
              setLikesInfo={setLikesInfo}
              likesInfo={likesInfo}
            />
            {isCreateReplyVisible &&
              (isCreateReplyLoading ? (
                <Loader height={81} size={70} />
              ) : (
                <WriteComment isReply={true} hide={handleToggleCreateReply} sendComment={handleCreateReply} />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Reply);
