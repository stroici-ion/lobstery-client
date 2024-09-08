import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { EmojiSvg, PlusSvg } from '../../icons';
import ContextMenu from '../ContextMenu';
import EmojiPicker from '../EmojiPicker';
import SmallButton from '../UI/Buttons/SmallButton';
import styles from './styles.module.scss';

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
        <ContextMenu
          width={250}
          maxHeight={300}
          openButton={(onClick: any) => (
            <SmallButton className={classNames(styles.root__button, styles.emoji)} onClick={onClick}>
              <EmojiSvg />
            </SmallButton>
          )}
        >
          <div className={styles.root__emojiPicker}>
            <EmojiPicker onClick={onEmojiClick} />
          </div>
        </ContextMenu>
      </div>
    </div>
  );
};

export default WriteText;
