import { GallerySvg, GuestSvg, HomeSvg, MessagingSvg, SignInSvg } from '../../icons';
import { HOME_ROUTE, LOGIN_ROUTE, POSTS_ROUTE } from '../../utils/consts';

export const primaryMenuMobileLinks = {
  links: [
    { id: 0, icon: <HomeSvg />, path: POSTS_ROUTE },
    { id: 1, icon: <GallerySvg />, path: POSTS_ROUTE },
    { id: 2, icon: <MessagingSvg />, path: POSTS_ROUTE },
  ],
  guest: {
    icon: <GuestSvg />,
    contextMenuLinks: [{ id: 0, icon: <SignInSvg />, path: LOGIN_ROUTE, text: 'Sign In' }],
  },
  user: {
    path: HOME_ROUTE,
  },
};