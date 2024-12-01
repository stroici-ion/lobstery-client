import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { EmojiSvg, PlusSvg } from '../../icons';
// import ContextMenu from '../ContextMenu';
import EmojiPicker from '../EmojiPicker';
import SmallButton from '../UI/buttons/SmallButton';
import styles from './styles.module.scss';
import { useContextMenu } from '../../hooks/useContextMenu';
import ContextMenu from '../UI/ContextMenu';

interface IWriteText {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const WriteText: React.FC<IWriteText> = ({ value, setValue, placeholder, className }) => {
  const [cursorPosition, setCursorPosition] = useState(value?.length || 0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onEmojiClick = (emoji: string) => {
    if (emoji) {
      const atEnd = value.length - cursorPosition;
      const textBeforeCursorPosition = value.substring(0, cursorPosition);
      const textAfterCursorPosition = value.substring(cursorPosition, value.length);
      const currentText = textBeforeCursorPosition + emoji + textAfterCursorPosition;
      setValue(currentText);
      setCursorPosition(currentText.length - atEnd);
      textareaRef.current?.focus();
    }
  };
  const ctx = useContextMenu();

  return (
    <div className={styles.root}>
      <TextareaAutosize
        ref={textareaRef}
        onBlur={(e) => setCursorPosition(e.target.selectionStart)}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={className || styles.root__input}
        placeholder={placeholder}
      />
      <div className={styles.root__left}>
        <button ref={ctx.triggerRef} className={styles.root__emojiBtn} onClick={ctx.onShow}>
          <EmojiSvg />
        </button>
        {ctx.isOpen && (
          <ContextMenu {...ctx}>
            <div className={styles.root__emojiPicker}>
              <EmojiPicker onClick={onEmojiClick} />
            </div>
          </ContextMenu>
        )}
      </div>
    </div>
  );
};

export default WriteText;
