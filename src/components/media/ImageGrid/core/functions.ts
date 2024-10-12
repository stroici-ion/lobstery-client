export const a = 1;

// const getCell = (type?: ImageArEnum) => {
//     switch (type) {
//       case ImageArEnum.wideUltra: {
//         const img = imagesWideUltra[0];
//         if (!img) break;
//         const cell: GridCell = {
//           src: img.image_thumbnail,
//           width: 100,
//           height: 100,
//           x: 0,
//           y: 0,
//           ar: img.aspect_ratio,
//           direction: false,
//           cells: [],
//         };
//         return cell;
//       }
//       case ImageArEnum.wide: {
//         const img = imagesWide[0];
//         if (!img) break;
//         const cell: GridCell = {
//           src: img.image_thumbnail,
//           width: 100,
//           height: 100,
//           x: 0,
//           y: 0,
//           ar: img.aspect_ratio,
//           direction: false,
//           cells: [],
//         };
//         return cell;
//       }
//       case ImageArEnum.square: {
//         const img = imagesSquare[0];
//         if (!img) break;
//         const cell: GridCell = {
//           src: img.image_thumbnail,
//           width: 100,
//           height: 100,
//           x: 0,
//           y: 0,
//           ar: img.aspect_ratio,
//           direction: false,
//           cells: [],
//         };
//         return cell;
//       }
//       case ImageArEnum.tinny: {
//         const img = imagesTinny[0];
//         if (!img) break;
//         const cell: GridCell = {
//           src: img.image_thumbnail,
//           width: 100,
//           height: 100,
//           x: 0,
//           y: 0,
//           ar: img.aspect_ratio,
//           direction: false,
//           cells: [],
//         };
//         return cell;
//       }
//       case ImageArEnum.tinnyUltra: {
//         const img = imagesTinnyUltra[0];
//         if (!img) break;
//         const cell: GridCell = {
//           src: img.image_thumbnail,
//           width: 100,
//           height: 100,
//           x: 0,
//           y: 0,
//           ar: img.aspect_ratio,
//           direction: false,
//           cells: [],
//         };
//         return cell;
//       }
//     }
//     const cell: GridCell = {
//       src: '',
//       width: 100,
//       height: 100,
//       x: 0,
//       y: 0,
//       ar: 1,
//       direction: false,
//       cells: [],
//     };
//     return cell;
//   };
