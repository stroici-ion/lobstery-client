import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import TagFriendsTab from './Core/TagFriendsTab';
import FeelingTab from './Core/FeelingsTab';
import PreviewTab from './Core/PreviewTab';
import ImagesTab from './Core/ImagesTab';
import styles from './styles.module.scss';
import Aside from './Core/Aside';
import UploadProgress from './Core/UploadProgress';
import TagsTab from './Core/TagsTab';
import { CloseSvg } from '../../icons';
import TextTab from './Core/TextTab';
import AudienceTab from './Core/AudienceTab';
import { selectUserId } from '../../redux/auth/selectors';
import { useAppDispatch } from '../../redux';
import { setImages } from '../../redux/images/slice';
import { selectActivePost } from '../../redux/posts/selectors';
import btnStyles from '../../styles/components/buttons/buttons.module.scss';
import { setAudience } from '../../redux/posts/slice';
import { selectUserProfile } from '../../redux/profile/selectors';

interface IAddPostForm {
  onHide: () => void;
  forceHide: () => void;
}

const AddPostForm: React.FC<IAddPostForm> = ({ onHide, forceHide }) => {
  const [selectedTab, setSelectedTab] = useState(2);
  const dispatch = useAppDispatch();
  const newPost = useSelector(selectActivePost);
  const userProfile = useSelector(selectUserProfile);
  const isLoaded = useRef(false);

  const handleError = () => initializeTab();
  const handleFulfilled = () => forceHide();

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = '';
  };

  const initializeTab = useCallback(() => {
    if (!newPost.imageSet.length) setSelectedTab(0);
  }, [newPost.imageSet.length]);

  useEffect(() => {
    if (newPost && !isLoaded.current) {
      isLoaded.current = true;
      initializeTab();
    }
  }, [newPost, initializeTab]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    if (userProfile.user.id) {
      dispatch(setImages(newPost.imageSet));
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (newPost.audience < 0)
      dispatch(
        setAudience({ audience: userProfile.defaultAudience, customAudience: userProfile.defaultCustomAudience })
      );
  }, []);

  return (
    <>
      <div className={styles.root}>
        {selectedTab !== -1 && <Aside selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
        <div className={styles.root__body}>
          {selectedTab !== -1 && (
            <button className={classNames(btnStyles.close)} onClick={onHide}>
              <CloseSvg />
            </button>
          )}
          <div className={classNames(styles.root__form, selectedTab === -1 && styles.uploading)}>
            {selectedTab === -1 && <UploadProgress handleError={handleError} handleFulfilled={handleFulfilled} />}
            {selectedTab === -2 && <PreviewTab setSelectedTab={setSelectedTab} />}
            {selectedTab === 0 && <TextTab />}
            {selectedTab === 1 && <AudienceTab />}
            {selectedTab === 2 && <ImagesTab />}
            {selectedTab === 3 && <TagsTab />}
            {selectedTab === 4 && <FeelingTab />}
            {selectedTab === 5 && <TagFriendsTab />}
          </div>
        </div>
      </div>
      <div className={styles.wrapper} />
    </>
  );
};

export default AddPostForm;
