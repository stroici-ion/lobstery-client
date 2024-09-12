import React, { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { EmojiSvg } from '../../../../icons';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import ContextMenu from '../../../ContextMenu';
import EmojiPicker from '../../../EmojiPicker';
import UserImage from '../../../UserImage';

type WriteIComment = {
  initialValue?: string;
  sendComment: (value: string) => Promise<void>;
  isReply?: boolean;
  isEditing?: boolean;
  hide?: () => void;
};

const WriteComment: React.FC<WriteIComment> = ({
  isReply = false,
  isEditing = false,
  sendComment,
  initialValue = '',
  hide,
}) => {
  const user = useSelector(selectUserProfile);
  console.log(user);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [value, setValue] = useState(initialValue);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isActive, setIsActive] = useState(isReply);

  const addCommentButtonText = isReply ? 'Reply' : isEditing ? 'Save' : 'Comment';

  useEffect(() => {
    if (textareaRef.current && hide) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [textareaRef.current]);

  const onEmojiClick = (emoji: string) => {
    if (emoji) {
      const atEnd = value.length - cursorPosition;
      const textBeforeCursorPosition = value.substring(0, cursorPosition);
      const textAfterCursorPosition = value.substring(cursorPosition, value.length);
      const currentText = textBeforeCursorPosition + emoji + textAfterCursorPosition;
      setValue(currentText);
      setCursorPosition(currentText.length - atEnd);
    }
  };

  const onKeydown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        buttonRef.current?.click();
      }
    }
  };

  const onClickCancel = () => {
    hide?.();
    setIsActive(false);
    setValue('');
    setCursorPosition(0);
  };

  const onClickSendComment = () => {
    if (!value.length) {
      return;
    }
    sendComment(value);
  };

  return (
    <div className={classNames(styles.addComment, !isEditing && styles.withPadding)}>
      {!isEditing && user.id && (
        <UserImage user={user} className={classNames(styles.addComment__image, isReply && styles.isReply)} />
      )}
      <div className={styles.addComment__writeBlock}>
        <TextareaAutosize
          onFocus={() => setIsActive(true)}
          onBlur={(e) => setCursorPosition(e.target.selectionStart)}
          value={value}
          onKeyDown={onKeydown}
          onChange={(e) => setValue(e.target.value)}
          ref={textareaRef}
          placeholder={`Enter ${isReply ? 'reply' : 'comment'} text`}
          className={classNames(styles.addComment__text, isReply && styles.isReply)}
        />
        <div className={styles.addComment__bottom}>
          <div className={classNames(styles.addComment__bottom_body, isActive && styles.active)}>
            <ContextMenu
              width={250}
              maxHeight={300}
              openButton={(onClick: any) => (
                <button className={styles.addComment__emojiButton} onClick={onClick}>
                  <EmojiSvg />
                </button>
              )}
            >
              <div className={styles.addComment__emojiPicker}>
                <EmojiPicker onClick={onEmojiClick} />
              </div>
            </ContextMenu>

            <div>
              <button
                ref={buttonRef}
                className={classNames(styles.addComment__button, isReply && styles.isReply, styles.cancelButton)}
                onClick={onClickCancel}
              >
                Cancel
              </button>
              <button
                ref={buttonRef}
                className={classNames(styles.addComment__button, isReply && styles.isReply, styles.yesButton)}
                onClick={onClickSendComment}
              >
                {addCommentButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteComment;
