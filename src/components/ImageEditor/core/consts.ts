//IMAGE EDIDOR
const devicePixelRatio = window.devicePixelRatio;

const imageEditorCropCornersSize = 50 * devicePixelRatio;
const imageEditorCropBordersSize = 30 * devicePixelRatio;

const imageEditorMinSelectionSize = imageEditorCropCornersSize * 2;

const imageEditorBorderSizeLeftRight = 5 * devicePixelRatio; //px
const imageEditorBorderSizeTop = 10 * devicePixelRatio; //px
const imageEditorBorderSizeBottom = 100 * devicePixelRatio; //px
const imageEditorSelectionBorderSize = 20 * devicePixelRatio; //px
const imageEditorSelectionBorderAutoDock = 3 * devicePixelRatio; //px
const imageEditorSlectedImagePreviewBorderSize = 30 * devicePixelRatio; //px
const imageEditorZoomPixelStep = 50; //px
const imageEditorMarkupLaziness = 5; //px
const imageEditorMinCropAR = 0.15; //px

export { devicePixelRatio as dpr };
export { imageEditorCropCornersSize as iECCS };
export { imageEditorCropBordersSize as iECBS };
export { imageEditorMinSelectionSize as iEMSS };
export { imageEditorBorderSizeLeftRight as iEBSLR };
export { imageEditorBorderSizeTop as iEBST };
export { imageEditorBorderSizeBottom as iEBSB };
export { imageEditorSelectionBorderSize as iESBS };
export { imageEditorSelectionBorderAutoDock as iESBAD };
export { imageEditorZoomPixelStep as iEZPS };
export { imageEditorMarkupLaziness as iEML };
export { imageEditorSlectedImagePreviewBorderSize as iESIPBS };
export { imageEditorMinCropAR as iEMAR };
