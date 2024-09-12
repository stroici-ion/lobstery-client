import classNames from 'classnames';
import React, { startTransition, useState } from 'react';

import styles from './styles.module.scss';
import KING_IMG from '../../assets/chess/king.png';
import QUEEN_IMG from '../../assets/chess/queen.png';
import ROOK_IMG from '../../assets/chess/rook.png';
import BISHOP_IMG from '../../assets/chess/bishop.png';
import KNIGHT_IMG from '../../assets/chess/knight.png';
import PAWN_IMG from '../../assets/chess/pawn.png';
import KING_WHITE_IMG from '../../assets/chess/king_white.png';
import QUEEN_WHITE_IMG from '../../assets/chess/queen_white.png';
import ROOK_WHITE_IMG from '../../assets/chess/rook_white.png';
import BISHOP_WHITE_IMG from '../../assets/chess/bishop_white.png';
import KNIGHT_WHITE_IMG from '../../assets/chess/knight_white.png';
import PAWN_WHITE_IMG from '../../assets/chess/pawn_white.png';

interface ITable {
  mainColor: boolean;
  selectedFigure: { i: number; j: number; figure: IFigure } | null;
  deletedBlackFigures: IFigure[];
  deletedWhiteFigures: IFigure[];
  figures: {
    warning?: boolean;
    whiteDominating: number;
    blackDominating: number;
    color: boolean;
    candidatePlace: boolean;
    figure: IFigure | null;
  }[][];
}

interface ISelectedFigure {
  figure: IFigure;
  i: number;
  j: number;
}

interface IFigure {
  movesCount: number;
  type: FigureTypeEnum;
  figure: string;
  color: boolean;
}

enum FigureTypeEnum {
  KING = 'KING',
  QUEEN = 'QUEEN',
  ROOK = 'ROOK',
  BISHOP = 'BISHOP',
  KNIGHT = 'KNIGHT',
  PAWN = 'PAWN',
}

const Games: React.FC = () => {
  const [table, setTable] = useState(initialTable);

  const onClickCell = (i: number, j: number) => {
    const newTable = pawnMooves(table, i, j);
    if (newTable !== undefined) setTable(newTable);
  };

  return (
    <div className={styles.root}>
      <div className={styles.root__game}>
        <div className={classNames(styles.root__row, styles.rowIndex)}>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((letter) => (
            <div key={letter} className={styles.root__index}>
              {letter}
            </div>
          ))}
        </div>
        <div className={styles.root__body}>
          <div className={styles.root__column}>
            {[8, 7, 6, 5, 4, 3, 2, 1].map((number) => (
              <div key={number} className={styles.root__indexVertical}>
                {number}
              </div>
            ))}
          </div>
          <div className={styles.root__chees}>
            {table.figures.map((row, i) => (
              <div className={styles.root__row} key={i}>
                {row.map((cell, j) => (
                  <div
                    key={i + '' + j}
                    className={classNames(
                      styles.root__cell,
                      styles.cell,
                      cell.candidatePlace && !cell.figure && styles.candidatePlace,
                      cell.warning && styles.warning,
                      cell.candidatePlace && cell.figure && styles.removeCandidate,
                      !!cell.figure?.figure && styles.active,
                      !cell.color && styles.black
                    )}
                    onClick={() => onClickCell(i, j)}
                  >
                    {cell.figure?.figure && <img className={styles.cell__figure} src={cell.figure?.figure} />}
                    <div className={styles.cell__candidatePlace}></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.root__column}>
            {[8, 7, 6, 5, 4, 3, 2, 1].map((number) => (
              <div key={number} className={styles.root__indexVertical}>
                {number}
              </div>
            ))}
          </div>
        </div>
        <div className={classNames(styles.root__row, styles.rowIndex)}>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((letter) => (
            <div key={letter} className={styles.root__index}>
              {letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;

const initialTable: ITable = {
  mainColor: false,
  deletedBlackFigures: [],
  deletedWhiteFigures: [],
  selectedFigure: null,
  figures: [
    [
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.ROOK, figure: ROOK_WHITE_IMG, color: true },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: {
          movesCount: 0,
          type: FigureTypeEnum.KNIGHT,
          figure: KNIGHT_WHITE_IMG,
          color: true,
        },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: {
          movesCount: 0,
          type: FigureTypeEnum.BISHOP,
          figure: BISHOP_WHITE_IMG,
          color: true,
        },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: { movesCount: 0, type: FigureTypeEnum.KING, figure: KING_WHITE_IMG, color: true },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: { movesCount: 0, type: FigureTypeEnum.QUEEN, figure: QUEEN_WHITE_IMG, color: true },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: {
          movesCount: 0,
          type: FigureTypeEnum.BISHOP,
          figure: BISHOP_WHITE_IMG,
          color: true,
        },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: {
          movesCount: 0,
          type: FigureTypeEnum.KNIGHT,
          figure: KNIGHT_WHITE_IMG,
          color: true,
        },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.ROOK, figure: ROOK_WHITE_IMG, color: true },
      },
    ],
    [
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_WHITE_IMG, color: true },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_WHITE_IMG, color: true },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_WHITE_IMG, color: true },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 4,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_WHITE_IMG, color: true },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 4,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_WHITE_IMG, color: true },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_WHITE_IMG, color: true },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_WHITE_IMG, color: true },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 1,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_WHITE_IMG, color: true },
      },
    ],
    [
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 2,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 2,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 3,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 2,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 2,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 3,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 2,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 2,
        figure: null,
      },
    ],
    [
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
    ],
    [
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: null,
      },
    ],
    [
      {
        color: false,
        candidatePlace: false,
        blackDominating: 2,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 2,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 3,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 2,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 2,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 3,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 2,
        whiteDominating: 0,
        figure: null,
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 2,
        whiteDominating: 0,
        figure: null,
      },
    ],
    [
      {
        color: true,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_IMG, color: false },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_IMG, color: false },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_IMG, color: false },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 4,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_IMG, color: false },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 4,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_IMG, color: false },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_IMG, color: false },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_IMG, color: false },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.PAWN, figure: PAWN_IMG, color: false },
      },
    ],
    [
      {
        color: false,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.ROOK, figure: ROOK_IMG, color: false },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.KNIGHT, figure: KNIGHT_IMG, color: false },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.BISHOP, figure: BISHOP_IMG, color: false },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.KING, figure: KING_IMG, color: false },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.QUEEN, figure: QUEEN_IMG, color: false },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.BISHOP, figure: BISHOP_IMG, color: false },
      },
      {
        color: false,
        candidatePlace: false,
        blackDominating: 1,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.KNIGHT, figure: KNIGHT_IMG, color: false },
      },
      {
        color: true,
        candidatePlace: false,
        blackDominating: 0,
        whiteDominating: 0,
        figure: { movesCount: 0, type: FigureTypeEnum.ROOK, figure: ROOK_IMG, color: false },
      },
    ],
  ],
};

const getClearCandidateTable = (table: ITable) => {
  return {
    ...table,
    figures: table.figures.map((row) =>
      row.map((cell) => {
        return { ...cell, candidatePlace: false };
      })
    ),
  };
};

const pawnMooves = (table: ITable, i: number, j: number) => {
  const figures = table.figures;

  if (figures[i][j].candidatePlace && table.selectedFigure) {
    let newTable = getClearCandidateTable(table);
    newTable.figures[table.selectedFigure.i][table.selectedFigure.j].figure = null;

    newTable.figures[i][j].figure = {
      ...table.selectedFigure.figure,
      movesCount: table.selectedFigure.figure.movesCount + 1,
    };

    newTable = recalculateDomination(newTable) || newTable;

    return newTable;
  }

  const newSelectedFigure = figures[i][j].figure;
  if (!newSelectedFigure) return;

  const newTable = getClearCandidateTable(table);
  newTable.selectedFigure = { figure: newSelectedFigure, i, j };

  switch (newTable.selectedFigure?.figure.type) {
    case FigureTypeEnum.PAWN: {
      if (newTable.selectedFigure.figure.color === table.mainColor) {
        if (figures[i - 1]?.[j]?.figure === null) {
          newTable.figures[i - 1][j].candidatePlace = true;
        }
        if (newTable.selectedFigure.figure.movesCount === 0) {
          if (figures[i - 2]?.[j]?.figure === null && figures[i - 1]?.[j]?.figure === null) {
            newTable.figures[i - 2][j].candidatePlace = true;
          }
        }
        if (figures[i - 1]?.[j - 1]?.figure)
          if (figures[i - 1][j - 1].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i - 1][j - 1].candidatePlace = true;
          }
        if (figures[i - 1]?.[j + 1]?.figure)
          if (figures[i - 1][j + 1].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i - 1][j + 1].candidatePlace = true;
          }
      } else {
        if (figures[i + 1]?.[j]?.figure === null) {
          newTable.figures[i + 1][j].candidatePlace = true;
        }
        if (newTable.selectedFigure.figure.movesCount === 0) {
          if (figures[i + 2]?.[j]?.figure === null && figures[i + 1]?.[j]?.figure === null) {
            newTable.figures[i + 2][j].candidatePlace = true;
          }
        }
        if (figures[i + 1]?.[j - 1]?.figure) {
          if (figures[i + 1][j - 1].figure?.color !== newTable.selectedFigure.figure.color)
            newTable.figures[i + 1][j - 1].candidatePlace = true;
        }
        if (figures[i + 1]?.[j + 1]?.figure)
          if (figures[i + 1][j + 1].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i + 1][j + 1].candidatePlace = true;
          }
      }
      break;
    }

    case FigureTypeEnum.KNIGHT: {
      if (figures[i - 2]?.[j + 1])
        if (figures[i - 2][j + 1].figure === null) {
          newTable.figures[i - 2][j + 1].candidatePlace = true;
        } else {
          if (figures[i - 2][j + 1].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i - 2][j + 1].candidatePlace = true;
          }
        }
      if (figures[i - 2]?.[j - 1])
        if (figures[i - 2][j - 1].figure === null) {
          newTable.figures[i - 2][j - 1].candidatePlace = true;
        } else {
          if (figures[i - 2][j - 1].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i - 2][j - 1].candidatePlace = true;
          }
        }
      if (figures[i + 2]?.[j + 1])
        if (figures[i + 2]?.[j + 1]?.figure === null) {
          newTable.figures[i + 2][j + 1].candidatePlace = true;
        } else {
          if (figures[i + 2][j + 1].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i + 2][j + 1].candidatePlace = true;
          }
        }
      if (figures[i + 2]?.[j - 1])
        if (figures[i + 2][j - 1].figure === null) {
          newTable.figures[i + 2][j - 1].candidatePlace = true;
        } else {
          if (figures[i + 2][j - 1].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i + 2][j - 1].candidatePlace = true;
          }
        }
      if (figures[i - 1]?.[j + 2])
        if (figures[i - 1][j + 2].figure === null) {
          newTable.figures[i - 1][j + 2].candidatePlace = true;
        } else {
          if (figures[i - 1][j + 2].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i - 1][j + 2].candidatePlace = true;
          }
        }
      if (figures[i - 1]?.[j - 2])
        if (figures[i - 1][j - 2].figure === null) {
          newTable.figures[i - 1][j - 2].candidatePlace = true;
        } else {
          if (figures[i - 1][j - 2].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i - 1][j - 2].candidatePlace = true;
          }
        }
      if (figures[i + 1]?.[j + 2])
        if (figures[i + 1][j + 2].figure === null) {
          newTable.figures[i + 1][j + 2].candidatePlace = true;
        } else {
          if (figures[i + 1][j + 2].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i + 1][j + 2].candidatePlace = true;
          }
        }
      if (figures[i + 1]?.[j - 2])
        if (figures[i + 1][j - 2].figure === null) {
          newTable.figures[i + 1][j - 2].candidatePlace = true;
        } else {
          if (figures[i + 1][j - 2].figure?.color !== newTable.selectedFigure.figure.color) {
            newTable.figures[i + 1][j - 2].candidatePlace = true;
          }
        }
      break;
    }

    case FigureTypeEnum.ROOK: {
      let isWall = false;
      for (let index = i + 1; index < newTable.figures.length; index++) {
        if (!isWall) {
          if (figures[index][j]?.figure === null) {
            newTable.figures[index][j].candidatePlace = true;
          } else {
            if (figures[index][j].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[index][j].candidatePlace = true;
            }
            isWall = true;
          }
        }
      }
      isWall = false;
      for (let index = i - 1; index >= 0; index--) {
        if (!isWall) {
          if (figures[index][j]?.figure === null) {
            newTable.figures[index][j].candidatePlace = true;
          } else {
            if (figures[index][j].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[index][j].candidatePlace = true;
            }
            isWall = true;
          }
        }
      }
      isWall = false;
      for (let index = j + 1; index < newTable.figures[i].length; index++) {
        if (!isWall) {
          if (figures[i][index]?.figure === null) {
            newTable.figures[i][index].candidatePlace = true;
          } else {
            if (figures[i][index].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i][index].candidatePlace = true;
            }
            isWall = true;
          }
        }
      }
      isWall = false;
      for (let index = j - 1; index >= 0; index--) {
        if (!isWall) {
          if (figures[i][index]?.figure === null) {
            newTable.figures[i][index].candidatePlace = true;
          } else {
            if (figures[i][index].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i][index].candidatePlace = true;
            }
            isWall = true;
          }
        }
      }
      break;
    }

    case FigureTypeEnum.BISHOP: {
      let isWall = false;
      let indexJ = j + 1;
      for (let index = i + 1; index < newTable.figures.length; index++) {
        if (!isWall) {
          if (figures[index]?.[indexJ]?.figure === null) {
            newTable.figures[index][indexJ].candidatePlace = true;
          } else {
            if (figures[index]?.[indexJ])
              if (figures[index][indexJ].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[index][indexJ].candidatePlace = true;
              }
            isWall = true;
          }
          indexJ++;
        }
      }
      isWall = false;
      indexJ = j - 1;
      for (let index = i - 1; index >= 0; index--) {
        if (!isWall) {
          if (figures[index]?.[indexJ]?.figure === null) {
            newTable.figures[index][indexJ].candidatePlace = true;
          } else {
            if (figures[index]?.[indexJ])
              if (figures[index][indexJ].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[index][indexJ].candidatePlace = true;
              }
            isWall = true;
          }
          indexJ--;
        }
      }
      isWall = false;
      let indexI = i - 1;
      for (let index = j + 1; index < newTable.figures[i].length; index++) {
        if (!isWall) {
          if (figures[indexI]?.[index]?.figure === null) {
            newTable.figures[indexI][index].candidatePlace = true;
          } else {
            if (figures[indexI]?.[index])
              if (figures[indexI][index].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[indexI][index].candidatePlace = true;
              }
            isWall = true;
          }
          indexI--;
        }
      }
      isWall = false;
      indexI = i + 1;
      for (let index = j - 1; index >= 0; index--) {
        if (!isWall) {
          if (figures[indexI]?.[index]?.figure === null) {
            newTable.figures[indexI][index].candidatePlace = true;
          } else {
            if (figures[indexI]?.[index])
              if (figures[indexI][index].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[indexI][index].candidatePlace = true;
              }
            isWall = true;
          }
          indexI++;
        }
      }
      break;
    }

    case FigureTypeEnum.QUEEN: {
      let isWall = false;
      for (let index = i + 1; index < newTable.figures.length; index++) {
        if (!isWall) {
          if (figures[index]?.[j]?.figure === null) {
            newTable.figures[index][j].candidatePlace = true;
          } else {
            if (figures[index]?.[j])
              if (figures[index][j].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[index][j].candidatePlace = true;
              }
            isWall = true;
          }
        }
      }
      isWall = false;
      for (let index = i - 1; index >= 0; index--) {
        if (!isWall) {
          if (figures[index]?.[j]?.figure === null) {
            newTable.figures[index][j].candidatePlace = true;
          } else {
            if (figures[index]?.[j])
              if (figures[index][j].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[index][j].candidatePlace = true;
              }
            isWall = true;
          }
        }
      }
      isWall = false;
      for (let index = j + 1; index < newTable.figures[i].length; index++) {
        if (!isWall)
          if (figures[i]?.[index]?.figure === null) {
            newTable.figures[i][index].candidatePlace = true;
          } else {
            if (figures[i]?.[index])
              if (figures[i][index].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[i][index].candidatePlace = true;
              }
            isWall = true;
          }
      }
      isWall = false;
      for (let index = j - 1; index >= 0; index--) {
        if (!isWall)
          if (figures[i]?.[index]?.figure === null) {
            newTable.figures[i][index].candidatePlace = true;
          } else {
            if (figures[i]?.[index])
              if (figures[i][index].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[i][index].candidatePlace = true;
              }
            isWall = true;
          }
      }
      isWall = false;
      let indexJ = j + 1;
      for (let index = i + 1; index < newTable.figures.length; index++) {
        if (!isWall)
          if (figures[index]?.[indexJ]?.figure === null) {
            newTable.figures[index][indexJ].candidatePlace = true;
          } else {
            if (figures[index]?.[indexJ])
              if (figures[index][indexJ].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[index][indexJ].candidatePlace = true;
              }
            isWall = true;
          }
        indexJ++;
      }
      isWall = false;
      indexJ = j - 1;
      for (let index = i - 1; index >= 0; index--) {
        if (!isWall)
          if (figures[index]?.[indexJ]?.figure === null) {
            newTable.figures[index][indexJ].candidatePlace = true;
          } else {
            if (figures[index]?.[indexJ])
              if (figures[index][indexJ].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[index][indexJ].candidatePlace = true;
              }
            isWall = true;
          }
        indexJ--;
      }
      isWall = false;
      let indexI = i - 1;
      for (let index = j + 1; index < newTable.figures[i].length; index++) {
        if (!isWall)
          if (figures[indexI]?.[index]?.figure === null) {
            newTable.figures[indexI][index].candidatePlace = true;
          } else {
            if (figures[indexI]?.[index])
              if (figures[indexI][index].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[indexI][index].candidatePlace = true;
              }
            isWall = true;
          }
        indexI--;
      }
      isWall = false;
      indexI = i + 1;
      for (let index = j - 1; index >= 0; index--) {
        if (!isWall)
          if (figures[indexI]?.[index]?.figure === null) {
            newTable.figures[indexI][index].candidatePlace = true;
          } else {
            if (figures[indexI]?.[index])
              if (figures[indexI][index].figure?.color !== newTable.selectedFigure.figure.color) {
                newTable.figures[indexI][index].candidatePlace = true;
              }
            isWall = true;
          }
        indexI++;
      }
      break;
    }

    case FigureTypeEnum.KING: {
      const atributeKey = newTable.selectedFigure.figure.color ? 'blackDominating' : 'whiteDominating';

      if (figures[i - 1]?.[j])
        if (figures[i - 1]?.[j][atributeKey] === 0)
          if (figures[i - 1][j].figure === null) {
            newTable.figures[i - 1][j].candidatePlace = true;
          } else {
            if (figures[i - 1][j].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i - 1][j].candidatePlace = true;
            }
          }
      if (figures[i - 1]?.[j + 1])
        if (figures[i - 1]?.[j + 1][atributeKey] === 0)
          if (figures[i - 1][j + 1].figure === null) {
            newTable.figures[i - 1][j + 1].candidatePlace = true;
          } else {
            if (figures[i - 1][j + 1].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i - 1][j + 1].candidatePlace = true;
            }
          }
      if (figures[i]?.[j + 1])
        if (figures[i]?.[j + 1][atributeKey] === 0)
          if (figures[i][j + 1].figure === null) {
            newTable.figures[i][j + 1].candidatePlace = true;
          } else {
            if (figures[i][j + 1].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i][j + 1].candidatePlace = true;
            }
          }
      if (figures[i + 1]?.[j + 1])
        if (figures[i + 1]?.[j + 1][atributeKey] === 0)
          if (figures[i + 1][j + 1].figure === null) {
            newTable.figures[i + 1][j + 1].candidatePlace = true;
          } else {
            if (figures[i + 1][j + 1].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i + 1][j + 1].candidatePlace = true;
            }
          }
      if (figures[i + 1]?.[j])
        if (figures[i + 1]?.[j][atributeKey] === 0)
          if (figures[i + 1][j].figure === null) {
            newTable.figures[i + 1][j].candidatePlace = true;
          } else {
            if (figures[i + 1][j].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i + 1][j].candidatePlace = true;
            }
          }
      if (figures[i + 1]?.[j - 1])
        if (figures[i + 1]?.[j - 1][atributeKey] === 0)
          if (figures[i + 1][j - 1].figure === null) {
            newTable.figures[i + 1][j - 1].candidatePlace = true;
          } else {
            if (figures[i + 1][j - 1].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i + 1][j - 1].candidatePlace = true;
            }
          }
      if (figures[i]?.[j - 1])
        if (figures[i]?.[j - 1][atributeKey] === 0)
          if (figures[i][j - 1].figure === null) {
            newTable.figures[i][j - 1].candidatePlace = true;
          } else {
            if (figures[i][j - 1].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i][j - 1].candidatePlace = true;
            }
          }
      if (figures[i - 1]?.[j - 1])
        if (figures[i - 1]?.[j - 1][atributeKey] === 0)
          if (figures[i - 1][j - 1].figure === null) {
            newTable.figures[i - 1][j - 1].candidatePlace = true;
          } else {
            if (figures[i - 1][j - 1].figure?.color !== newTable.selectedFigure.figure.color) {
              newTable.figures[i - 1][j - 1].candidatePlace = true;
            }
          }
      break;
    }
  }
  return newTable;
};

const recalculateDomination = (table: ITable) => {
  const figures = table.figures;
  const newTable = {
    ...table,
    figures: table.figures.map((row) =>
      row.map((cell) => {
        return {
          ...cell,
          whiteDominating: 0,
          blackDominating: 0,
          warning: false,
        };
      })
    ),
  };

  const king1 = [8, 8];
  const king2 = [8, 8];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const cell = table.figures[i][j];
      if (cell.figure === null) continue;
      const atributeKey = cell.figure.color ? 'whiteDominating' : 'blackDominating';
      if (cell.figure.type === FigureTypeEnum.PAWN) {
        if (cell.figure.color === table.mainColor) {
          if (figures[i - 1]?.[j - 1]) {
            newTable.figures[i - 1][j - 1][atributeKey]++;
          }
          if (figures[i - 1]?.[j + 1]) {
            newTable.figures[i - 1][j + 1][atributeKey]++;
          }
        } else {
          if (figures[i + 1]?.[j - 1]) {
            newTable.figures[i + 1][j - 1][atributeKey]++;
          }
          if (figures[i + 1]?.[j + 1]) {
            newTable.figures[i + 1][j + 1][atributeKey]++;
          }
        }
      } else if (cell.figure.type === FigureTypeEnum.KNIGHT) {
        if (figures[i - 2]?.[j + 1]) {
          newTable.figures[i - 2][j + 1][atributeKey]++;
        }
        if (figures[i - 2]?.[j - 1]) {
          newTable.figures[i - 2][j - 1][atributeKey]++;
        }
        if (figures[i + 2]?.[j + 1]) {
          newTable.figures[i + 2][j + 1][atributeKey]++;
        }
        if (figures[i + 2]?.[j - 1]) {
          newTable.figures[i + 2][j - 1][atributeKey]++;
        }
        if (figures[i - 1]?.[j + 2]) {
          newTable.figures[i - 1][j + 2][atributeKey]++;
        }
        if (figures[i - 1]?.[j - 2]) {
          newTable.figures[i - 1][j - 2][atributeKey]++;
        }
        if (figures[i + 1]?.[j + 2]) {
          newTable.figures[i + 1][j + 2][atributeKey]++;
        }
        if (figures[i + 1]?.[j - 2]) {
          newTable.figures[i + 1][j - 2][atributeKey]++;
        }
      } else if (cell.figure.type === FigureTypeEnum.ROOK) {
        for (let index = i + 1; index < newTable.figures.length; index++) {
          if (figures[index]?.[j]) {
            if (figures[index][j].figure === null) {
              newTable.figures[index][j][atributeKey]++;
            } else {
              newTable.figures[index][j][atributeKey]++;
              break;
            }
          }
        }
        for (let index = i - 1; index >= 0; index--) {
          if (figures[index]?.[j]) {
            if (figures[index][j].figure === null) {
              newTable.figures[index][j][atributeKey]++;
            } else {
              newTable.figures[index][j][atributeKey]++;
              break;
            }
          }
        }
        for (let index = j + 1; index < newTable.figures[i].length; index++) {
          if (figures[i]?.[index]) {
            if (figures[i][index].figure === null) {
              newTable.figures[i][index][atributeKey]++;
            } else {
              newTable.figures[i][index][atributeKey]++;
              break;
            }
          }
        }
        for (let index = j - 1; index >= 0; index--) {
          if (figures[i]?.[index]) {
            if (figures[i][index].figure === null) {
              newTable.figures[i][index][atributeKey]++;
            } else {
              newTable.figures[i][index][atributeKey]++;
              break;
            }
          }
        }
      } else if (cell.figure.type === FigureTypeEnum.BISHOP) {
        let indexJ = j + 1;
        for (let index = i + 1; index < newTable.figures.length; index++) {
          if (figures[index]?.[indexJ]) {
            if (figures[index][indexJ].figure === null) {
              newTable.figures[index][indexJ][atributeKey]++;
            } else {
              newTable.figures[index][indexJ][atributeKey]++;
              break;
            }
            indexJ++;
          }
        }
        indexJ = j - 1;
        for (let index = i - 1; index >= 0; index--) {
          if (figures[index]?.[indexJ]) {
            if (figures[index][indexJ].figure === null) {
              newTable.figures[index][indexJ][atributeKey]++;
            } else {
              newTable.figures[index][indexJ][atributeKey]++;
              break;
            }
            indexJ--;
          }
        }
        let indexI = i - 1;
        for (let index = j + 1; index < newTable.figures[i].length; index++) {
          if (figures[indexI]?.[index]) {
            if (figures[indexI][index].figure === null) {
              newTable.figures[indexI][index][atributeKey]++;
            } else {
              newTable.figures[indexI][index][atributeKey]++;
              break;
            }
            indexI--;
          }
        }
        indexI = i + 1;
        for (let index = j - 1; index >= 0; index--) {
          if (figures[indexI]?.[index]) {
            if (figures[indexI][index].figure === null) {
              newTable.figures[indexI][index][atributeKey]++;
            } else {
              newTable.figures[indexI][index][atributeKey]++;
              break;
            }
            indexI++;
          }
        }
      } else if (cell.figure.type === FigureTypeEnum.QUEEN) {
        for (let index = i + 1; index < newTable.figures.length; index++) {
          if (figures[index]?.[j]) {
            if (figures[index][j].figure === null) {
              newTable.figures[index][j][atributeKey]++;
            } else {
              newTable.figures[index][j][atributeKey]++;
              break;
            }
          }
        }
        for (let index = i - 1; index >= 0; index--) {
          if (figures[index]?.[j]) {
            if (figures[index][j].figure === null) {
              newTable.figures[index][j][atributeKey]++;
            } else {
              newTable.figures[index][j][atributeKey]++;
              break;
            }
          }
        }
        for (let index = j + 1; index < newTable.figures[i].length; index++) {
          if (figures[i]?.[index]) {
            if (figures[i]?.[index]?.figure === null) {
              newTable.figures[i][index][atributeKey]++;
            } else {
              newTable.figures[i][index][atributeKey]++;
              break;
            }
          }
        }
        for (let index = j - 1; index >= 0; index--) {
          if (figures[i]?.[index]) {
            if (figures[i][index].figure === null) {
              newTable.figures[i][index][atributeKey]++;
            } else {
              newTable.figures[i][index][atributeKey]++;
              break;
            }
          }
        }
        let indexJ = j + 1;
        for (let index = i + 1; index < newTable.figures.length; index++) {
          if (figures[index]?.[indexJ]) {
            if (figures[index][indexJ].figure === null) {
              newTable.figures[index][indexJ][atributeKey]++;
            } else {
              newTable.figures[index][indexJ][atributeKey]++;
              break;
            }
            indexJ++;
          }
        }
        indexJ = j - 1;
        for (let index = i - 1; index >= 0; index--) {
          if (figures[index]?.[indexJ]) {
            if (figures[index][indexJ].figure === null) {
              newTable.figures[index][indexJ][atributeKey]++;
            } else {
              newTable.figures[index][indexJ][atributeKey]++;
              break;
            }
            indexJ--;
          }
        }
        let indexI = i - 1;
        for (let index = j + 1; index < newTable.figures[i].length; index++) {
          if (figures[indexI]?.[index]) {
            if (figures[indexI][index].figure === null) {
              newTable.figures[indexI][index][atributeKey]++;
            } else {
              newTable.figures[indexI][index][atributeKey]++;
              break;
            }
            indexI--;
          }
        }
        indexI = i + 1;
        for (let index = j - 1; index >= 0; index--) {
          if (figures[indexI]?.[index]) {
            if (figures[indexI][index].figure === null) {
              newTable.figures[indexI][index][atributeKey]++;
            } else {
              newTable.figures[indexI][index][atributeKey]++;
              break;
            }
            indexI++;
          }
        }
      } else if (cell.figure.type === FigureTypeEnum.KING) {
        if (king1[0] === 8) {
          king1[0] = i;
          king1[1] = j;
        } else {
          king2[0] = i;
          king2[1] = j;
        }
        if (figures[i - 1]?.[j]) newTable.figures[i - 1][j][atributeKey] += 1;
        if (figures[i - 1]?.[j + 1]) newTable.figures[i - 1][j + 1][atributeKey] += 1;
        if (figures[i]?.[j + 1]) newTable.figures[i][j + 1][atributeKey] += 1;
        if (figures[i + 1]?.[j + 1]) newTable.figures[i + 1][j + 1][atributeKey] += 1;
        if (figures[i + 1]?.[j]) newTable.figures[i + 1][j][atributeKey] += 1;
        if (figures[i + 1]?.[j - 1]) newTable.figures[i + 1][j - 1][atributeKey] += 1;
        if (figures[i]?.[j - 1]) newTable.figures[i][j - 1][atributeKey] += 1;
        if (figures[i - 1]?.[j - 1]) newTable.figures[i - 1][j - 1][atributeKey] += 1;
      }
    }
  }

  const king1Cell = newTable.figures[king1[0]][king1[1]];
  const king2Cell = newTable.figures[king2[0]][king2[1]];

  if (king1Cell[king1Cell.figure?.color ? 'blackDominating' : 'whiteDominating'] > 0) {
    newTable.figures[king1[0]][king1[1]].warning = true;
  }

  if (king2Cell[king2Cell.figure?.color ? 'blackDominating' : 'whiteDominating'] > 0) {
    newTable.figures[king2[0]][king2[1]].warning = true;
  }

  return newTable;
};
