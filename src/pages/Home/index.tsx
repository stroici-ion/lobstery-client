import React from 'react';

import styles from './styles.module.scss';
import { selectUserProfile } from '../../redux/profile/selectors';
import getUserName from '../../components/user/utils/getUserName';
import { useSelector } from 'react-redux';
import UserImage from '../../components/UserImage';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import btnStyles from '../../styles/components/buttons/solidLightButtons.module.scss';
import { PROFILE_ROUTE, USER_SETTINGS_ROUTE } from '../../utils/consts';
import { EditSvg, FriendsSvg, GallerySvg, ImagesVideoSvg, UserSvg } from '../../icons';
import ProfilePosts from './core/Posts';
import Container from '../../layouts/Container';

const Home: React.FC = () => {
  const userProfile = useSelector(selectUserProfile);

  return (
    <Container className={styles.root}>
      <div className={styles.root__body}>
        <div className={classNames(styles.root__top, styles.top)}>
          <div
            className={styles.top__cover}
            style={{ background: `url(${userProfile.user?.profile?.cover}) center/cover no-repeat` }}
          ></div>
          <div className={styles.top__avatar}>
            <img src={userProfile.user?.profile?.avatar} alt="Avatar" />
          </div>
          <div className={styles.top__info}>
            <div>
              <h2 className={styles.top__userName}>{getUserName(userProfile.user)}</h2>
              <p className={styles.top__friendsCount}>
                {userProfile.friendsCount} • {`friend${userProfile.friendsCount > 1 ? 's' : ''}`}
              </p>
              <div className={styles.top__friendsList}>
                {userProfile.friends.map((f) => (
                  <div className={styles.top__friendsAvatarContainer}>
                    <UserImage key={f.id} user={f} className={styles.top__friendsAvatar} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.top__infoRight}>
              <Link to={USER_SETTINGS_ROUTE}>
                <button className={classNames(styles.top__editProfileButton, btnStyles.orangeSolid)}>
                  <EditSvg />
                  Edit profile
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className={classNames(styles.root__posts, styles.posts)}>
          <div className={styles.posts__tabs}>
            <Link to={PROFILE_ROUTE + '#posts'} className={classNames(styles.posts__tabItem, styles.active)}>
              <ImagesVideoSvg /> Posts
            </Link>
            <Link to={PROFILE_ROUTE + '#about'} className={classNames(styles.posts__tabItem)}>
              <UserSvg /> About
            </Link>
            <Link to={PROFILE_ROUTE + '#friends'} className={classNames(styles.posts__tabItem)}>
              <FriendsSvg /> Friends
            </Link>
            <Link to={PROFILE_ROUTE + '#images'} className={classNames(styles.posts__tabItem)}>
              <GallerySvg /> Images
            </Link>
          </div>
          <ProfilePosts />
        </div>
      </div>
      <div className={styles.root__aside}></div>
    </Container>
  );
};

export default Home;
