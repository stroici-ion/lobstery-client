import layouts from './grid-layouts';
import { TCell, TGridCell, TImageArType, TImagesTypes, TLayout, TMIImage, TRemainedImagesLocation } from '../types';
import { IImage } from '../../../../redux/images/types';

export function getOrderedGrid(images: IImage[], remainedImagesLocation: TRemainedImagesLocation) {
  if (!images.length) return;

  const mainCell: TGridCell = {
    imageSrc: '',
    imageId: -1,
    orderId: -1,
    key: 'main',
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
  if (images.length === 1) {
    mainCell.ar = images[0].aspectRatio;
    mainCell.imageId = images[0].id;
    mainCell.orderId = images[0].orderId;
    return mainCell;
  }

  const mImages = getModifiedImages(images);
  const mainImage = mImages[0];

  const rImages = mImages.slice(1);

  const { iWU, iW, iS, iT, iTU } = getImageArrTypeOptions(rImages);
  const imagesTypes: TImagesTypes = {
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

  if (currentLayout) {
    const imagesRest: TMIImage[] = [];
    const layoutTypesCount = getLayoutTypesCount(currentLayout);

    for (let k in layoutTypesCount) {
      const key = k as TImageArType;
      if (key) imagesRest.push(...imagesTypes[key].slice(layoutTypesCount[k]));
    }

    let isRemainedImgLocationSet = false;
    const getOrderedCell = (lCell: TCell) => {
      const cell = getEmptyCell();
      if (lCell.type) {
        switch (lCell.type) {
          case 'R':
            isRemainedImgLocationSet = true;
            if (!imagesRest.length) return;
            if (lCell.isVertical) cell.direction = true;
            cell.key = 'rest';
            const totalAspectRatio = imagesRest.reduce((sum, c) => sum + c.aspectRatio, 0);
            if (totalAspectRatio > 7) {
              const cells1 = getCells(...imagesRest.filter((i, index) => index < imagesRest.length / 2));
              const cells2 = getCells(...imagesRest.filter((i, index) => index >= imagesRest.length / 2));
              if (cell.direction) {
                cell.direction = false;
                cell.cells = [getColumn(...cells1), getColumn(...cells2)];
              } else {
                cell.direction = true;
                cell.cells = [getRow(...cells1), getRow(...cells2)];
              }
            } else cell.cells = getCells(...imagesRest);
            break;
          case 'M':
            cell.ar = mainImage.aspectRatio;
            cell.key = 'm' + mainImage.id;
            cell.imageId = mainImage.id;
            cell.orderId = mainImage.orderId;
            break;
          default:
            const img = imagesTypes[lCell.type].shift();
            if (img) {
              cell.ar = img.aspectRatio;
              cell.key = 'c' + img.id;
              cell.imageId = img.id;
              cell.orderId = img.orderId;
            }
        }
      } else {
        if (lCell.isVertical) cell.direction = true;
        const cells: TGridCell[] = [];
        lCell.cells?.forEach((lc) => {
          const c = getOrderedCell(lc);
          if (c) cells.push(c);
        });
        cell.key = 'c' + cells.map((cell) => cell.key).toString();
        cell.cells = cells;
      }
      return cell;
    };

    const mCell = getOrderedCell(currentLayout.cell);
    if (!isRemainedImgLocationSet && mCell && imagesRest.length > 0) {
      const cell = getEmptyCell();

      const isVertical = remainedImagesLocation === 'top' || remainedImagesLocation === 'bottom';
      cell.key = 'rest';

      const totalAspectRatio = imagesRest.reduce((sum, c) => sum + (isVertical ? c.aspectRatio : 1 / c.aspectRatio), 0);

      const maxAr = isVertical ? 7 : 3.5;

      if (totalAspectRatio > maxAr) {
        const cells1 = getCells(...imagesRest.filter((i, index) => index < imagesRest.length / 2));
        const cells2 = getCells(...imagesRest.filter((i, index) => index >= imagesRest.length / 2));
        if (!isVertical) {
          cell.direction = false;
          cell.cells = [getColumn(...cells1), getColumn(...cells2)];
        } else {
          cell.direction = true;
          cell.cells = [getRow(...cells1), getRow(...cells2)];
        }
      } else {
        if (!isVertical) cell.direction = true;
        else cell.direction = false;
        cell.cells = getCells(...imagesRest);
      }

      switch (remainedImagesLocation) {
        case 'left':
          mCell.cells.unshift(cell);
          mCell.direction = false;
          break;
        case 'right':
          mCell.cells.push(cell);
          mCell.direction = false;
          break;
        case 'top':
          mCell.direction = true;
          mCell.cells.unshift(cell);
          break;
        case 'bottom':
          mCell.direction = true;
          mCell.cells.push(cell);
          break;
      }
    }

    if (mCell) mainCell.cells.push(mCell);
  } else {
    mainCell.ar = mainImage.aspectRatio;
  }

  return mainCell;
}

const getEmptyCell = (): TGridCell => {
  return {
    imageId: -1,
    orderId: -1,
    imageSrc: '',
    key: 'c',
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

const getAvailableLayouts = (selectedArType: TImageArType, typesCount: Record<string, number>) => {
  const selectedTypeLayouts = layouts.filter((l) => l.mainType === selectedArType);

  const availableLayouts: TLayout[] = [];
  selectedTypeLayouts.forEach((l) => {
    if (isLayoutMeetRequirements(l, typesCount)) availableLayouts.push(l);
  });

  return availableLayouts;
};

const isLayoutMeetRequirements = (l: TLayout, typesCount: Record<string, number>) => {
  const layoutTypesCount = getLayoutTypesCount(l);
  let f = true;
  for (let k in typesCount) {
    if (l.onlyRequired) {
      if (typesCount[k] !== layoutTypesCount[k]) f = false;
    } else if (typesCount[k] < layoutTypesCount[k]) f = false;
  }
  return f;
};

const getLayoutTypesCount = (l: TLayout) => {
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

const getCell = (img: IImage): TGridCell => {
  return {
    imageId: img.id,
    orderId: img.orderId,
    key: 'key' + img.id,
    imageSrc: '',
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
    ar: img ? img.aspectRatio : 1,
    direction: false,
    cells: [],
  };
};

const getRow = (...cells: TGridCell[]): TGridCell => {
  const key = 'key' + cells.map((cell) => cell.key).toString();
  return {
    key,
    imageSrc: '',
    imageId: 0,
    orderId: 0,
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

const getColumn = (...cells: TGridCell[]): TGridCell => {
  const key = 'key' + cells.map((cell) => cell.key).toString();
  return {
    key,
    imageSrc: '',
    imageId: 0,
    orderId: 0,
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

const getCells = (...images: TMIImage[]): TGridCell[] => {
  return images.map((i) => getCell(i));
};

const getModifiedImages = (images: IImage[]): TMIImage[] => {
  function getModifiedImage(i: IImage): TMIImage {
    let arType: TImageArType;
    if (i.aspectRatio > 2.2) {
      arType = 'WU';
    } else if (i.aspectRatio <= 2.2 && i.aspectRatio > 1.2) {
      arType = 'W';
    } else if (i.aspectRatio <= 1.2 && i.aspectRatio > 0.8) {
      arType = 'S';
    } else if (i.aspectRatio <= 0.8 && i.aspectRatio > 0.4) {
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

const getImageArrTypeOptions = (images: TMIImage[]) => {
  const iWU = images.filter((i) => i.arType === 'WU');
  const iW = images.filter((i) => i.arType === 'W');
  const iS = images.filter((i) => i.arType === 'S');
  const iT = images.filter((i) => i.arType === 'T');
  const iTU = images.filter((i) => i.arType === 'TU');

  return { iWU, iW, iS, iT, iTU };
};
