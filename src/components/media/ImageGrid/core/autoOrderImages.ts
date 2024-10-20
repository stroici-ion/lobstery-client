import { IImage } from '../../../../models/IImage';
import layouts from './grid-layouts';
import { TGridCell } from '../../../../models/media-tools/images-grid';
import {
  TCell,
  TImageArType,
  TImagesTypes,
  TLayout,
  TMIImage,
  TRemainedImagesLocation,
} from '../../../../models/media-tools/images-auto-order';

export function getLayout(images: IImage[], remainedImagesLocation: TRemainedImagesLocation) {
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

  //Cells
  const mainCell: TGridCell = {
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
            cell.id = 'rest';
            const totalAspectRatio = imagesRest.reduce((sum, c) => sum + c.aspect_ratio, 0);
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
        const cells: TGridCell[] = [];
        lCell.cells?.forEach((lc) => {
          const c = getOrderedCell(lc);
          if (c) cells.push(c);
        });
        cell.id = 'c' + cells.map((cell) => cell.id).toString();
        cell.cells = cells;
      }
      return cell;
    };

    console.log(currentLayout);

    const mcell = getOrderedCell(currentLayout.cell);
    if (!isRemainedImgLocationSet && mcell && imagesRest.length > 0) {
      console.log('Ordering');

      const cell = getEmptyCell();

      const isVertical = remainedImagesLocation === 'top' || remainedImagesLocation === 'bottom';
      cell.id = 'rest';

      const totalAspectRatio = imagesRest.reduce(
        (sum, c) => sum + (isVertical ? c.aspect_ratio : 1 / c.aspect_ratio),
        0
      );

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
          mcell.cells.unshift(cell);
          mcell.direction = false;
          break;
        case 'right':
          mcell.cells.push(cell);
          mcell.direction = false;
          break;
        case 'top':
          mcell.direction = true;
          mcell.cells.unshift(cell);
          break;
        case 'bottom':
          mcell.direction = true;
          mcell.cells.push(cell);
          break;
      }
    }

    if (mcell) mainCell.cells.push(mcell);
  } else {
    mainCell.src = mainImage.image_thumbnail;
    mainCell.ar = mainImage.aspect_ratio;
  }

  return mainCell;
}

const getEmptyCell = (): TGridCell => {
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

const getRow = (...cells: TGridCell[]): TGridCell => {
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

const getColumn = (...cells: TGridCell[]): TGridCell => {
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

const getCells = (...images: TMIImage[]): TGridCell[] => {
  return images.map((i) => getCell(i));
};

const getModifiedImages = (images: IImage[]): TMIImage[] => {
  function getModifiedImage(i: IImage): TMIImage {
    let arType: TImageArType;
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

const getImageArrTypeOptions = (images: TMIImage[]) => {
  const iWU = images.filter((i) => i.arType === 'WU');
  const iW = images.filter((i) => i.arType === 'W');
  const iS = images.filter((i) => i.arType === 'S');
  const iT = images.filter((i) => i.arType === 'T');
  const iTU = images.filter((i) => i.arType === 'TU');

  return { iWU, iW, iS, iT, iTU };
};
