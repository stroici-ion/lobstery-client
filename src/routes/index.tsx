import UserSettings from '../pages/UserSettings';
import Auth from '../pages/Auth';
import {
  PROFILE_ROUTE,
  LOGIN_ROUTE,
  POSTS_ROUTE,
  PRODUCTS_ROUTE,
  REGISTRATION_ROUTE,
  USER_SETTINGS_ROUTE,
  GAMES_ROUTE,
  POST_DETAIL_ROUTE,
} from '../utils/consts';
import Posts from '../pages/Posts';
import Games from '../pages/Games';
import PostDetail from '../pages/PostDetail';
import Home from '../pages/Home';

export const authRoutes = [
  { path: LOGIN_ROUTE, element: <Auth /> },
  { path: REGISTRATION_ROUTE, element: <Auth /> },
];

export const publicRoutes = [
  { path: PROFILE_ROUTE, element: <Home /> },
  { path: PRODUCTS_ROUTE, element: <Posts /> },
  { path: POSTS_ROUTE, element: <Posts /> },
];

export const privateRoutes = [
  { path: POSTS_ROUTE, element: <Posts /> },
  { path: POST_DETAIL_ROUTE, element: <PostDetail /> },
  { path: USER_SETTINGS_ROUTE, element: <UserSettings /> },
  { path: GAMES_ROUTE, element: <Games /> },
];
