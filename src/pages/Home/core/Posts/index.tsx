import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import ButtonsRow from '../../../../components/UI/buttons/ButtonsRow';
import { FavoriteSvg, ImagesVideoSvg, LikeSvg, PinSvg } from '../../../../icons';
import { selectUserProfile } from '../../../../redux/profile/selectors';
import Post from '../../../../components/Post';
import { useAppDispatch } from '../../../../redux';
import { fetchPostsByUser } from '../../../../redux/posts/asyncActions';

interface IProfilePosts {}

const ProfilePosts: React.FC<IProfilePosts> = () => {
  const userProfile = useSelector(selectUserProfile);
  const [postsParams, setPostsParams] = useState({ filterBy: 'all', limit: '10', page: '0' });
  const dispatch = useAppDispatch();
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchPostsByUser({ user: userProfile.user.id + '', ...postsParams }));
  }, [postsParams]);

  const getOnClickFilter = (filterBy: string) => {
    return () => {
      setPostsParams({ ...postsParams, filterBy });
      if (topRef.current) {
        topRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };
  };

  let a = 1;

  const navButtons = [
    {
      id: 1,
      children: (
        <>
          <ImagesVideoSvg />
          All Posts
        </>
      ),
      onClick: getOnClickFilter('all'),
    },
    {
      id: 2,
      children: (
        <>
          <ImagesVideoSvg />
          My Posts
        </>
      ),
      onClick: getOnClickFilter('my'),
    },
    {
      id: 3,
      children: (
        <>
          <LikeSvg />
          Liked
        </>
      ),
      onClick: getOnClickFilter('liked'),
    },
    {
      id: 4,
      children: (
        <>
          <FavoriteSvg />
          Favorites
        </>
      ),
      onClick: getOnClickFilter('favorites'),
    },
  ];

  return (
    <div className={styles.root} ref={topRef}>
      <ButtonsRow buttons={navButtons} className={styles.root__nav} />
      <div className={styles.root__posts}>
        {userProfile.posts.map((p) => (
          <Post key={p.id} post={{ ...p, viewsCount: 100 }} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePosts;
