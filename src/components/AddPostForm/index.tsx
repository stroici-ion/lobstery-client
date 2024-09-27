import React, { useEffect, useState } from 'react';
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
import { fetchDefaultAudience } from '../../redux/defaultAudience/asyncActions';
import { useAppDispatch } from '../../redux';
import { selectActiveImage } from '../../redux/images/selectors';
import { setImages } from '../../redux/images/slice';
import { selectActivePost } from '../../redux/posts/selectors';

interface IAddPostForm {
  onHide: () => void;
}

const AddPostForm: React.FC<IAddPostForm> = ({ onHide }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useAppDispatch();
  const newPost = useSelector(selectActivePost);
  const activeImage = useSelector(selectActiveImage);
  const userId = useSelector(selectUserId);

  const handleHide = () => onHide();

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = ''; // Standard way to trigger the confirmation dialog
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    if (userId) {
      dispatch(fetchDefaultAudience({ userId }));
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
          <button className={styles.root__return} onClick={handleHide}>
            <CloseSvg />
          </button>
          <div className={styles.root__form}>
            {selectedTab === -1 && <UploadProgress />}
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
    </>
  );
};

export default AddPostForm;
