import React, { useEffect, useState } from 'react';

import TagFriendsTab from './Core/TagFriendsTab';
import FeelingTab from './Core/FeelingsTab';
import PreviewTab from './Core/PreviewTab';
import classNames from 'classnames';
import ImagesTab from './Core/ImagesTab';
import styles from './styles.module.scss';
import Aside from './Core/Aside';
import UploadProgress from './Core/UploadProgress';
import TagsTab from './Core/TagsTab';
import { ReturnBackSvg } from '../../icons';
import { useSelector } from 'react-redux';
import EditImagesForm from '../EditImagesForm';
import TextTab from './Core/TextTab';
import AudienceTab from './Core/AudienceTab';
import { selectUserId } from '../../redux/auth/selectors';
import { fetchDefaultAudience } from '../../redux/defaultAudience/asyncActions';
import { useAppDispatch } from '../../redux';
import { selectActiveImage } from '../../redux/images/selectors';
import { setImages } from '../../redux/images/slice';
import { selectActivePost } from '../../redux/posts/selectors';

const AddPostForm: React.FC = () => {
  const [selectedTab, setSelectedtab] = useState(0);
  const dispatch = useAppDispatch();
  const newPost = useSelector(selectActivePost);
  const activeImage = useSelector(selectActiveImage);
  const userId = useSelector(selectUserId);

  const handleReturnToMainTab = () => {
    setSelectedtab(0);
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchDefaultAudience({ userId }));
      dispatch(setImages(newPost.image_set));
    }
  }, []);

  return (
    <div className={classNames(styles.root, selectedTab === 10 && styles.fullScreen)}>
      <Aside selectedTab={selectedTab} setSelectedtab={setSelectedtab} />
      <div className={styles.root__body}>
        {selectedTab !== 10 && (
          <button
            className={classNames(styles.root__return, selectedTab >= 0 && styles.active)}
            onClick={handleReturnToMainTab}
          >
            <ReturnBackSvg />
          </button>
        )}
        <div className={classNames(styles.root__main_form, selectedTab < 0 && styles.active)}>
          {selectedTab === -1 && <UploadProgress />}
          {selectedTab === -2 && <PreviewTab setSelectedtab={setSelectedtab} />}
        </div>
        <div className={classNames(styles.root__form, selectedTab >= 0 && styles.active)}>
          {selectedTab === 0 && <TextTab />}
          {selectedTab === 1 && <AudienceTab />}
          {selectedTab === 2 && <ImagesTab setSelectedTab={setSelectedtab} />}
          {selectedTab === 3 && <TagsTab />}
          {selectedTab === 4 && <FeelingTab />}
          {selectedTab === 5 && <TagFriendsTab />}
          {selectedTab === 10 && activeImage?.id && (
            <EditImagesForm onHide={() => setSelectedtab(2)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPostForm;
