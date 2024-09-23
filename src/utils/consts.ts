//API
export const MAIN_LAYOUT_ROUTE = '';
export const AUTH_LAYOUT_ROUTE = '/auth';

export const LOGIN_ROUTE = AUTH_LAYOUT_ROUTE + '/login/';
export const REGISTRATION_ROUTE = AUTH_LAYOUT_ROUTE + '/register/';

export const HOME_ROUTE = '/';
export const PRODUCTS_ROUTE = '/products/';
export const POSTS_ROUTE = '/posts/';
export const POST_DETAIL_ROUTE = '/posts/:id';
export const ADD_POST_ROUTE = '/add-post/';
export const GAMES_ROUTE = '/games/';

export const USER_SETTINGS_ROUTE = '/user-settings/';
export const USER_PROFILE_ROUTE = '/user-settings/';

//CONTEXT MENU
export const defaultContextMenuWidth = 150;
export const defaultContextMenuMaxHeight = 150;

//IMAGE EDIDOR
export const dpr = window.devicePixelRatio;
export const imageEditorMinSelectionSize = 101 * dpr;
export const imageEditorBorderSizeLeftRight = 50 * dpr; //px
export const imageEditorBorderSizeTop = 30 * dpr; //px
export const imageEditorBorderSizeBottom = 130 * dpr; //px
export const imageEditorSelectionBorderSize = 20 * dpr; //px
export const imageEditorSelectionBorderAutoDock = 3 * dpr; //px
export const imageEditorZoomPixelStep = 30; //px
export const imageEditorMarkupLaziness = 5; //px
