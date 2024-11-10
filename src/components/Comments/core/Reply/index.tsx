import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { createReply, editComment, removeComment } from '../../../../services/comments/CommentsServices';
import { getTime } from '../../../../utils/getTime';
import CommentActions from '../CommentActions';
import ExtensibleText from '../ExtensibleText';
import WriteComment from '../WriteComment';
import styles from './styles.module.scss';
import { EditSvg, ReportSvg } from '../../../../icons';
import DeleteSvg from '../../../../icons/DeleteSvg';
import CommentContextMenu from '../CommentContextMenu';
import { IUser } from '../../../../models/IUser';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import Loader from '../../../Loader';
import UserImage from '../../../UserImage';
import { IReply } from '../../../../models/comments/IComment';
import { ILikesInfo } from '../../../../models/likes/ILikesInfo';

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
  const userData = useSelector(selectUserProfile);
  const [isCreateReplyVisible, setIsCreateReplyVisible] = useState(false);
  const [isCreateReplyLoading, setIsCreateReplyLoading] = useState(false);
  const [, setIsEditingReplyLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateReply = async (text: string) => {
    if (userData) {
      setIsCreateReplyLoading(true);
      const mentionedUser = reply.user.id !== userData.id ? reply.user.id : undefined;
      const res = await createReply(postId, commentId, text, mentionedUser);

      if (res) {
        const newReply: IReply = {
          ...res,
          isLikedByAuthor: false,
          likesCount: 0,
          dislikesCount: 0,
          liked: false,
          disliked: false,
          user: {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profile: userData.profile && {
              avatar: userData.profile.avatar,
              avatarThumbnail: userData.profile.avatarThumbnail,
              cover: userData.profile.cover,
            },
          },
          mentionedUser: reply.user.id !== userData?.id ? reply.user : undefined,
        };
        setRecentReplies((recentReplies) => [...recentReplies, newReply]);
      }
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
      <button className={styles.submenu__edit} onClick={handleToogleEditReply}>
        <EditSvg />
        Edit reply
      </button>
    ),
    deleteButton: (
      <button className={styles.submenu__delete} onClick={handleRemoveReply}>
        <DeleteSvg />
        Delete reply
      </button>
    ),
    reportButton: (
      <button className={styles.submenu__delete} onClick={handleRemoveReply}>
        <ReportSvg />
        Report reply
      </button>
    ),
  };

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
                <p
                  className={classNames(
                    styles.comment__nameInfo,
                    reply.user.id === owner.id && styles.comment__nameInfo_owner
                  )}
                >
                  {`${reply.user.firstName} ${reply.user.lastName}`}
                </p>
                <span className={styles.comment__timeInfo}>{getTime(reply.createdAt)}</span>
              </div>
              <CommentContextMenu
                ownerId={owner.id}
                commentOwnerId={reply.user.id}
                className={styles.submenu}
                buttons={replyContextMenuButtons}
              />
            </div>
            <ExtensibleText className={styles.comment__text} refUser={reply.mentionedUser} text={reply.text} />
            <CommentActions
              isMultimedia={isMultimedia}
              owner={owner}
              isOwner={userData?.id === owner.id}
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
