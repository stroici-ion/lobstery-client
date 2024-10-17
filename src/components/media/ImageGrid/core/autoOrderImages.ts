import { get } from 'http';
import { IImage } from '../../../../models/IImage';
import { GridCell } from '../../../../models/media-tools/images-grid/IGridCell';
import layouts from './grid-layouts';

type ImageArType = 'WU' | 'W' | 'S' | 'T' | 'TU';

type MIImage = IImage & {
  arType: ImageArType;
};

type ImagesTypes = {
  WU: MIImage[];
  W: MIImage[];
  S: MIImage[];
  T: MIImage[];
  TU: MIImage[];
};

export type Cell = {
  isVertical?: boolean;
  type?: ImageArType | 'R' | 'M';
  cells?: Cell[];
};

export type Layout = {
  onlyRequired?: boolean;
  cell: Cell;
  mainType: ImageArType;
  requiredTypes: ImageArType[];
};

export function getLayout(images: IImage[]) {
  const mImages = getModifiedImages(images);
  const mainImage = mImages[0];

  const rImages = mImages.slice(1);

  const { iWU, iW, iS, iT, iTU } = getImageArrTypeOptions(rImages);
  const imagesTypes: ImagesTypes = {
    WU: iWU,
    W: iW,
    S: iS,
    T: iT,
    TU: iTU,
  };

  const typesCount: Record<string, number> = {
    WU: iWU.length,
    W: iW.length,
    S: iS.length,
    T: iT.length,
    TU: iTU.length,
  };

  const availableLayouts = getAvailableLayouts(mainImage.arType, typesCount);

  const currentLayout = availableLayouts[0];

  //Cells

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

  if (currentLayout) {
    const imagesRest: MIImage[] = [];
    const layoutTypesCount = getLayoutTypesCount(currentLayout);

    for (let k in layoutTypesCount) {
      const key = k as ImageArType;
      if (key) imagesRest.push(...imagesTypes[key].slice(layoutTypesCount[k]));
    }

    const getOrderedCell = (lCell: Cell) => {
      const cell = getEmptyCell();
      if (lCell.type) {
        switch (lCell.type) {
          case 'R':
            if (!imagesRest.length) return;
            if (lCell.isVertical) cell.direction = true;
            cell.id = 'rest';
            const totalAspectRatio = imagesRest.reduce((sum, c) => sum + c.aspect_ratio, 0);
            if (totalAspectRatio > 7)
              if (cell.direction) {
                cell.direction = false;
                cell.cells = [
                  getColumn(...getCells(...imagesRest.filter((i, index) => index < imagesRest.length / 2))),
                  getColumn(...getCells(...imagesRest.filter((i, index) => index >= imagesRest.length / 2))),
                ];
              } else {
                cell.direction = true;
                cell.cells = [
                  getRow(...getCells(...imagesRest.filter((i, index) => index < imagesRest.length / 2))),
                  getRow(...getCells(...imagesRest.filter((i, index) => index >= imagesRest.length / 2))),
                ];
              }
            else cell.cells = getCells(...imagesRest);
            break;
          case 'M':
            cell.id = 'm' + mainImage.id;
            cell.ar = mainImage.aspect_ratio;
            cell.src = mainImage.image_thumbnail;
            break;
          default:
            const img = imagesTypes[lCell.type].shift();
            if (img) {
              cell.ar = img.aspect_ratio;
              cell.id = 'c' + img.id;
              cell.src = img.image_thumbnail;
            }
        }
      } else {
        if (lCell.isVertical) cell.direction = true;
        const cells: GridCell[] = [];
        lCell.cells?.forEach((lc) => {
          const c = getOrderedCell(lc);
          if (c) cells.push(c);
        });
        cell.id = 'c' + cells.map((cell) => cell.id).toString();
        cell.cells = cells;
      }
      return cell;
    };

    const cell = getOrderedCell(currentLayout.cell);
    if (cell) mainCell.cells.push(cell);
    console.log(mainCell);
  } else {
    mainCell.src = mainImage.image_thumbnail;
    mainCell.ar = mainImage.aspect_ratio;
  }

  return mainCell;
}

const getEmptyCell = (): GridCell => {
  return {
    id: 'c',
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
};

const getAvailableLayouts = (selectedArType: ImageArType, typesCount: Record<string, number>) => {
  const selectedTypeLayouts = layouts.filter((l) => l.mainType === selectedArType);

  const availableLayouts: Layout[] = [];
  selectedTypeLayouts.forEach((l) => {
    if (isLayoutMeetRequirements(l, typesCount)) availableLayouts.push(l);
  });

  return availableLayouts;
};

const isLayoutMeetRequirements = (l: Layout, typesCount: Record<string, number>) => {
  const layoutTypesCount = getLayoutTypesCount(l);
  let f = true;
  for (let k in typesCount) {
    if (l.onlyRequired) {
      if (typesCount[k] !== layoutTypesCount[k]) f = false;
    } else if (typesCount[k] < layoutTypesCount[k]) f = false;
  }
  return f;
};

const getLayoutTypesCount = (l: Layout) => {
  const count: Record<string, number> = {
    WU: 0,
    W: 0,
    S: 0,
    T: 0,
    TU: 0,
  };
  l.requiredTypes.forEach((t) => {
    count[t]++;
  });
  return count;
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

const getModifiedImages = (images: IImage[]): MIImage[] => {
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
    return {
      ...i,
      arType,
    };
  }

  return images.map((i) => getModifiedImage(i));
};

const getImageArrTypeOptions = (images: MIImage[]) => {
  const iWU = images.filter((i) => i.arType === 'WU');
  const iW = images.filter((i) => i.arType === 'W');
  const iS = images.filter((i) => i.arType === 'S');
  const iT = images.filter((i) => i.arType === 'T');
  const iTU = images.filter((i) => i.arType === 'TU');

  return { iWU, iW, iS, iT, iTU };
};

// const getRemainedImages = (images: MIImage[], ...sImages: MIImage[]) => {
//   return images.filter((i) => !sImages.some((sI) => sI.image_thumbnail === i.image_thumbnail));
// };
