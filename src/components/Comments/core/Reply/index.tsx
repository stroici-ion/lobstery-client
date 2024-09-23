import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { createReply, editComment, removeComment } from '../../../../services/CommentsServices';
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
import { ILikesInfo, IReply } from '../../../../models/comments/IComment';
import Loader from '../../../Loader';
import UserImage from '../../../UserImage';

interface IReplyFC {
  isMultimedia: boolean;
  owner: IUser;
  reply: IReply;
  commentId: number;
  setRecentReplies: React.Dispatch<React.SetStateAction<IReply[]>>;
  setFeetchedReplies?: React.Dispatch<React.SetStateAction<IReply[]>>;
  postId: number;
}

const Reply: React.FC<IReplyFC> = ({
  isMultimedia,
  owner,
  postId,
  reply,
  commentId,
  setRecentReplies,
  setFeetchedReplies,
}) => {
  const userData = useSelector(selectUserProfile);
  const [isCreateReplyVisible, setIsCreateReplyVisible] = useState(false);
  const [isCreateReplyLoading, setIsCreateReplyLoading] = useState(false);
  const [isEditingReplyLoading, setIsEditingReplyLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateReply = async (text: string) => {
    if (userData) {
      setIsCreateReplyLoading(true);
      const res = await createReply({
        text,
        post: postId,
        parent: commentId,
        user: userData.id,
        reply_to: reply.user.id !== userData.id ? reply.user.id : undefined,
      });

      if (res) {
        const newReply: IReply = {
          ...res,
          liked_by_author: false,
          likes_count: 0,
          dislikes_count: 0,
          liked: false,
          disliked: false,
          //must chkeck later
          user: {
            id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            profile: userData.profile && {
              avatar: userData.profile.avatar,
              avatar_thumbnail: userData.profile.avatar_thumbnail,
              cover: userData.profile.cover,
            },
          },
          reply_to: reply.user.id !== userData?.id ? reply.user : undefined,
        };
        setRecentReplies((recentReplies) => [...recentReplies, newReply]);
      }
      setIsCreateReplyLoading(false);
      setIsCreateReplyVisible(false);
    }
  };

  const handleToggleCreateRelpy = () => {
    setIsCreateReplyVisible(!isCreateReplyVisible);
  };

  const likesInfo = {
    liked: reply.liked,
    disliked: reply.disliked,
    likes_count: reply.likes_count,
    dislikes_count: reply.dislikes_count,
    liked_by_author: reply.liked_by_author,
  };

  const setLikesInfo = (
    fetchedLikesInfo: ILikesInfo & {
      liked_by_author: boolean;
    }
  ) => {
    if (setFeetchedReplies) {
      setFeetchedReplies((feetchedReplies) =>
        feetchedReplies.map((item) => (item.id === reply.id ? { ...reply, ...fetchedLikesInfo } : item))
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
      if (setFeetchedReplies) {
        setFeetchedReplies((replies) => replies.filter((item) => item.id !== reply.id));
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
      if (setFeetchedReplies) {
        setFeetchedReplies((replies) =>
          replies.map((item) => (item.id === reply.id ? { ...item, text: value } : item))
        );
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
                  {`${reply.user.first_name} ${reply.user.last_name}`}
                </p>
                <span className={styles.comment__timeInfo}>{getTime(reply.created_at)}</span>
              </div>
              <CommentContextMenu
                ownerId={owner.id}
                commentOwnerId={reply.user.id}
                className={styles.submenu}
                buttons={replyContextMenuButtons}
              />
            </div>
            <ExtensibleText className={styles.comment__text} refUser={reply.reply_to} text={reply.text} />
            <CommentActions
              isMultimedia={isMultimedia}
              owner={owner}
              isOwner={userData?.id === owner.id}
              isReply={true}
              id={reply.id}
              className={styles.root__actions}
              handleToggleCreateRelpy={handleToggleCreateRelpy}
              setLikesInfo={setLikesInfo}
              likesInfo={likesInfo}
            />
            {isCreateReplyVisible &&
              (isCreateReplyLoading ? (
                <Loader height={81} size={70} />
              ) : (
                <WriteComment isReply={true} hide={handleToggleCreateRelpy} sendComment={handleCreateReply} />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Reply);
