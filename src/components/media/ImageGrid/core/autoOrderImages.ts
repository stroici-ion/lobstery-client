import { IImage } from '../../../../models/IImage';
import { GridCell } from '../../../../models/media-tools/images-grid/IGridCell';
import layouts from './grid-layouts';

type ImageArType = 'WU' | 'W' | 'S' | 'T' | 'TU';

type MIImage = IImage & {
  arType: ImageArType;
};

export type Cell = {
  type?: ImageArType | 'R' | 'M';
  isVertical?: boolean;
  cells?: Cell[];
};

export type Layout = {
  cell: Cell;
  mainType: ImageArType;
  requiredTypes: ImageArType[];
};

function getLayout(images: IImage[]) {
  const { mImages, typesCount } = getModifiedImages(images);
  const mainImage = mImages[0];
  typesCount[mainImage.arType]--;
  const availableLayouts = layouts.filter((l) => l.mainType === mainImage.arType);
}

export function getImagesOrder(images: IImage[]) {
  const mainCell: GridCell = {
    id: 'keymain',
    src: '',
    styles: {
      top: '0%',
      left: '0%',
      width: '100%',
      height: '100%',
    },
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    ar: 1,
    direction: false,
    cells: [],
  };
  if (images.length > 1) {
    const { mImages } = getModifiedImages(images);
    const mImg = mImages[0];
    const mImgCell = {
      id: 'key' + mImg.id,
      src: mImg.image_thumbnail,
      styles: {
        top: '0%',
        left: '0%',
        width: '100%',
        height: '100%',
      },
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      ar: mImg.aspect_ratio,
      direction: false,
      cells: [],
    };
    const rImages = mImages.slice(1);
    const { iWU, iW, iS, iT, iTU, isOnlyWideUltra, isOnlyWide, isOnlySquare, isOnlyTinny, isOnlyTinnyUltra } =
      getImageArrTypeOptions(rImages);

    switch (mImg.arType) {
      case 'T':
        {
          if (iT.length === 1 && iW.length === 1) {
            const sImg = iT[0];
            const rest = getRemainedImages(rImages, sImg);
            if (rest.length > 0) {
              mainCell.cells.push(getRow(mImgCell, getCell(sImg)));
              mainCell.direction = true;
              mainCell.cells.push(getRow(...getCells(...rest)));
            } else {
              mainCell.cells.push(mImgCell, getCell(sImg));
            }
          } else if (iW.length) {
            const sImg = iW[0];
            const rest = getRemainedImages(rImages, sImg);
            if (rest.length > 0) {
              mainCell.cells.push(getRow(mImgCell, getCell(sImg)));
              mainCell.direction = true;
              mainCell.cells.push(getRow(...getCells(...rest)));
            } else {
              mainCell.cells.push(mImgCell, getCell(sImg));
            }
          } else if (iT.length > 0 && iS.length > 1) {
            const sImg1 = iT[0];
            const sImg2 = iS[0];
            const sImg3 = iS[1];
            const rest = getRemainedImages(rImages, sImg1, sImg2, sImg3);
            if (rest.length > 0) {
              mainCell.direction = true;
              mainCell.cells.push(getRow(mImgCell, getCell(sImg1), getColumn(...getCells(sImg2, sImg3))));
              mainCell.cells.push(getRow(...getCells(...rest)));
            } else mainCell.cells.push(mImgCell, getCell(sImg1), getColumn(...getCells(sImg2, sImg3)));
          } else if (iT.length > 2) {
            const sImg1 = iT[0];
            const sImg2 = iT[1];
            const sImg3 = iT[2];
            const rest = getRemainedImages(rImages, sImg1, sImg2, sImg3);
            if (rest.length > 0) {
              mainCell.direction = true;
              mainCell.cells.push(getRow(mImgCell, ...getCells(sImg1, sImg2, sImg3)));
              mainCell.cells.push(getRow(...getCells(...rest)));
            } else {
              mainCell.cells.push(mImgCell, ...getCells(sImg1, sImg2, sImg3));
            }
          } else if (iS.length > 1) {
            const sImg1 = iS[0];
            const sImg2 = iS[1];
            const rest = getRemainedImages(rImages, sImg1, sImg2);
            if (rest.length > 0) {
              mainCell.direction = true;
              mainCell.cells.push(getRow(mImgCell, ...getCells(sImg1, sImg2)));
              mainCell.cells.push(getRow(...getCells(...rest)));
            } else {
              mainCell.cells.push(getRow(mImgCell, getColumn(...getCells(sImg1, sImg2))));
            }
          } else if (iWU.length) {
            const sImg = iWU[0];
            const rest = getRemainedImages(rImages, sImg);
            if (rest.length > 0) {
              mainCell.cells.push(getRow(mImgCell, getCell(sImg)));
              mainCell.cells.push(getRow(...getCells(...rest)));
            } else {
              mainCell.cells.push(mImgCell, getCell(sImg));
            }
          } else {
            mainCell.cells.push(...getCells(...mImages));
          }
        }
        break;
      case 'W':
        if (iS.length > 1) {
          const sImg1 = iS[0];
          const sImg2 = iS[1];
          const rest = getRemainedImages(rImages, sImg1, sImg2);
          if (rest.length > 0) {
            mainCell.direction = true;
            mainCell.cells.push(getRow(mImgCell, ...getCells(sImg1, sImg2)));
            mainCell.cells.push(getRow(...getCells(...rest)));
          } else {
            mainCell.cells.push(getRow(mImgCell, getColumn(...getCells(sImg1, sImg2))));
          }
        } else if (iT.length) {
          const sImg = iT[0];
          const rest = getRemainedImages(rImages, sImg);
          if (rest.length > 0) {
            mainCell.cells.push(getRow(mImgCell, getCell(sImg)));
            mainCell.direction = true;
            mainCell.cells.push(...getRemainedImagesRow(rest));
          } else {
            mainCell.cells.push(mImgCell, getCell(sImg));
          }
        } else mainCell.cells.push(...getCells(...mImages));
        break;
      default: {
        mainCell.cells.push(...getCells(...mImages));
      }
    }
  } else {
    mainCell.src = images[0].image_thumbnail;
    mainCell.ar = images[0].aspect_ratio;
  }
  return mainCell;
}

const getRemainedImagesRow = (imgs: MIImage[]): GridCell[] => {
  const totalAspectRatio = imgs.reduce((sum, c) => sum + c.aspect_ratio, 0);
  if (totalAspectRatio > 7)
    return [
      getRow(...getCells(...imgs.filter((i, index) => index < imgs.length / 2))),
      getRow(...getCells(...imgs.filter((i, index) => index >= imgs.length / 2))),
    ];
  return [getRow(...getCells(...imgs))];
};

const getCell = (img: IImage): GridCell => {
  return {
    id: 'key' + img.id,
    src: img.image_thumbnail,
    styles: {
      top: '0%',
      left: '0%',
      width: '100%',
      height: '100%',
    },
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    ar: img ? img.aspect_ratio : 1,
    direction: false,
    cells: [],
  };
};

const getRow = (...cells: GridCell[]): GridCell => {
  const id = 'key' + cells.map((cell) => cell.id).toString();
  return {
    id,
    src: '',
    styles: {
      top: '0%',
      left: '0%',
      width: '100%',
      height: '100%',
    },
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    ar: 1,
    direction: false,
    cells: [...cells],
  };
};

const getColumn = (...cells: GridCell[]): GridCell => {
  const id = 'key' + cells.map((cell) => cell.id).toString();
  return {
    id: id,
    src: '',
    styles: {
      top: '0%',
      left: '0%',
      width: '100%',
      height: '100%',
    },
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    ar: 1,
    direction: true,
    cells: [...cells],
  };
};

const getCells = (...images: MIImage[]): GridCell[] => {
  return images.map((i) => getCell(i));
};

const getModifiedImages = (images: IImage[]): { mImages: MIImage[]; typesCount: Record<string, number> } => {
  const typesCount = {
    WU: 0,
    W: 0,
    S: 0,
    T: 0,
    TU: 0,
  };

  function getModifiedImage(i: IImage): MIImage {
    let arType: ImageArType;
    if (i.aspect_ratio > 2.2) {
      arType = 'WU';
    } else if (i.aspect_ratio <= 2.2 && i.aspect_ratio > 1.5) {
      arType = 'W';
    } else if (i.aspect_ratio <= 1.5 && i.aspect_ratio > 0.8) {
      arType = 'S';
    } else if (i.aspect_ratio <= 0.8 && i.aspect_ratio > 0.4) {
      arType = 'T';
    } else {
      arType = 'TU';
    }
    typesCount[arType]++;
    return {
      ...i,
      arType,
    };
  }

  return { mImages: images.map((i) => getModifiedImage(i)), typesCount };
};

const getRemainedImages = (images: MIImage[], ...sImages: MIImage[]) => {
  return images.filter((i) => !sImages.some((sI) => sI.image_thumbnail === i.image_thumbnail));
};

const getImageArrTypeOptions = (images: MIImage[]) => {
  const iWU = images.filter((i) => i.arType === 'WU');
  const iW = images.filter((i) => i.arType === 'W');
  const iS = images.filter((i) => i.arType === 'S');
  const iT = images.filter((i) => i.arType === 'T');
  const iTU = images.filter((i) => i.arType === 'TU');

  const isOnlyWideUltra = !iW.length && !iS.length && !iT.length && !iTU.length;
  const isOnlyWide = !iW.length && !iS.length && !iT.length && !iTU.length;
  const isOnlySquare = !iW.length && !iS.length && !iT.length && !iTU.length;
  const isOnlyTinny = !iW.length && !iS.length && !iT.length && !iTU.length;
  const isOnlyTinnyUltra = !iW.length && !iS.length && !iT.length && !iTU.length;

  return { iWU, iW, iS, iT, iTU, isOnlyWideUltra, isOnlyWide, isOnlySquare, isOnlyTinny, isOnlyTinnyUltra };
};

// function getColumn(...cells: GridCell[]) {
//   const cell = getCell();
//   cell.direction = true;
//   cell.cells.push(...cells);
// }

// function getColumn(...cells: GridCell[]) {
//   const cell = getCell();
//   cell.direction = true;
//   cell.cells.push(...cells);
// }

// function getRow(...cells: GridCell[]) {
//   const cell = getCell();
//   cell.cells.push(...cells);
// }
