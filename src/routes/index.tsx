import UserSettings from '../pages/UserSettings';
import Auth from '../pages/Auth';
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  POSTS_ROUTE,
  PRODUCTS_ROUTE,
  REGISTRATION_ROUTE,
  USER_SETTINGS_ROUTE,
  GAMES_ROUTE,
  POST_DETAIL_ROUTE,
  POSTS_CREATE_ROUTE,
  POSTS_CREATE_IMAGE_EDIT_ROUTE,
} from '../utils/consts';
import Posts from '../pages/Posts';
import Games from '../pages/Games';
import AddPostForm from '../components/AddPostForm';
import PostDetail from '../pages/PostDetail';
import EditImages from '../components/media/EditImages';

export const authRoutes = [
  { path: LOGIN_ROUTE, element: <Auth /> },
  { path: REGISTRATION_ROUTE, element: <Auth /> },
];

export const publicRoutes = [
  { path: HOME_ROUTE, element: <Posts /> },
  { path: PRODUCTS_ROUTE, element: <Posts /> },
  { path: POSTS_ROUTE, element: <Posts /> },
];

export const privateRoutes = [
  {
    path: POSTS_ROUTE,
    element: <Posts />,
    // children: [
    //   {
    //     path: POSTS_CREATE_ROUTE,
    //     element: <AddPostForm />,
    //     children: [{ path: POSTS_CREATE_IMAGE_EDIT_ROUTE, element: <EditImages /> }],
    //   },
    //   ,
    // ],
  },
  { path: POST_DETAIL_ROUTE, element: <PostDetail /> },
  { path: USER_SETTINGS_ROUTE, element: <UserSettings /> },
  { path: GAMES_ROUTE, element: <Games /> },
];
