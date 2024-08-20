import classNames from 'classnames';
import React, { useState } from 'react';
import emoji from 'react-easy-emoji';
import styles from './styles.module.scss';

interface IEmojiPicker {
  className?: string;
  onClick: (emoji: string) => void;
}

const EmojiPicker: React.FC<IEmojiPicker> = ({ className, onClick }) => {
  const [type, setType] = useState('FACE');

  return (
    <div className={classNames(styles.root, className)}>
      <p className={styles.root__title}>How are you feeling?</p>
      <div className={styles.root__emojis}>
        <div className={styles.root__scrollArea}>
          {emojisDecMap
            .filter((emojiObj) => emojiObj.text.includes(type))
            .map((emojiObj) => (
              <button
                onClick={() => onClick(String.fromCodePoint(emojiObj.code[0]))}
                className={styles.root__button}
                key={emojiObj.code[0]}
              >
                <span>{emoji(String.fromCodePoint(emojiObj.code[0]))}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;

const emojisDecMap = [
  { code: [128512], text: 'GRINNING FACE' },
  { code: [128513], text: 'GRINNING FACE WITH SMILING EYES' },
  { code: [128514], text: 'FACE WITH TEARS OF JOY' },
  { code: [129315], text: 'ROLLING ON THE FLOOR LAUGHING' },
  { code: [128515], text: 'SMILING FACE WITH OPEN MOUTH' },
  {
    code: [128516],
    text: 'SMILING FACE WITH OPEN MOUTH AND SMILING EYES , smiling face with open mouth & smiling eyes',
  },
  {
    code: [128517],
    text: 'SMILING FACE WITH OPEN MOUTH AND COLD SWEAT , smiling face with open mouth & cold sweat',
  },
  {
    code: [128518],
    text: 'SMILING FACE WITH OPEN MOUTH AND TIGHTLY-CLOSED EYES , smiling face with open mouth & closed eyes',
  },
  { code: [128521], text: 'WINKING FACE' },
  { code: [128522], text: 'SMILING FACE WITH SMILING EYES' },
  { code: [128523], text: 'FACE SAVOURING DELICIOUS FOOD' },
  { code: [128526], text: 'SMILING FACE WITH SUNGLASSES' },
  {
    code: [128525],
    text: 'SMILING FACE WITH HEART-SHAPED EYES , smiling face with heart-eyes',
  },
];
