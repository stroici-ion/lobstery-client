import React, { startTransition, useEffect, useRef, useState } from 'react';
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

interface IAddPostForm {
  onHide: () => void;
  forceHide: () => void;
}

const AddPostForm: React.FC<IAddPostForm> = ({ onHide, forceHide }) => {
  const [selectedTab, setSelectedTab] = useState(2);
  const dispatch = useAppDispatch();
  const newPost = useSelector(selectActivePost);
  const userId = useSelector(selectUserId);
  const isLoaded = useRef(false);

  const handleError = () => initializeTab();
  const handleFullfilled = () => forceHide();

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = '';
  };

  const initializeTab = () => {
    if (!newPost.image_set.length) setSelectedTab(0);
  };

  useEffect(() => {
    if (newPost && !isLoaded.current) {
      isLoaded.current = true;
      initializeTab();
    }
  }, [newPost]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    if (userId) {
      dispatch(setImages(newPost.image_set));
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <div className={classNames(styles.root)}>
        <Aside selectedTab={selectedTab} setSelectedtab={setSelectedTab} />
        <div className={styles.root__body}>
          <button className={styles.root__return} onClick={onHide}>
            <CloseSvg />
          </button>
          <div className={styles.root__form}>
            {selectedTab === -1 && <UploadProgress handleError={handleError} handleFullfilled={handleFullfilled} />}
            {selectedTab === -2 && <PreviewTab setSelectedtab={setSelectedTab} />}
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
