import UserSettings from '../pages/UserSettings';
import Products from '../pages/Products';
import AddPost from '../pages/AddPost';
import Auth from '../pages/Auth';
import Home from '../pages/Home';
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  POSTS_ROUTE,
  PRODUCTS_ROUTE,
  ADD_POST_ROUTE,
  REGISTRATION_ROUTE,
  USER_SETTINGS_ROUTE,
  GAMES_ROUTE,
} from '../utils/consts';
import Posts from '../pages/Posts';
import Games from '../pages/Games';

export const authRoutes = [
  { path: LOGIN_ROUTE, element: <Auth /> },
  { path: REGISTRATION_ROUTE, element: <Auth /> },
];

export const publicRoutes = [
  { path: HOME_ROUTE, element: <Posts /> },
  { path: PRODUCTS_ROUTE, element: <Posts /> },
  { path: POSTS_ROUTE, element: <Posts /> },
  { path: ADD_POST_ROUTE, element: <AddPost /> },
];

export const privateRoutes = [
  { path: USER_SETTINGS_ROUTE, element: <UserSettings /> },
  { path: GAMES_ROUTE, element: <Games /> },
];
