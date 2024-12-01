import React, { useEffect, useState } from 'react';

import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../redux/profile/selectors';
import Loader from '../Loader';
import { EditSvg, ReturnBackSvg } from '../../icons';
import classNames from 'classnames';

import CustomAudienceRow from './Core/CustomAudienceRow';
import { useAppDispatch } from '../../redux';

import DeleteSvg from '../../icons/DeleteSvg';
import EditCustomAudience from './Core/EditCustomAudience';
import { EFetchStatus } from '../../types/enums';
import ScrollArea from '../UI/ScrollArea';
import { IAudience } from '../../redux/profile/audienceTypes';
import btnStyles from '../../styles/components/buttons/solidLightButtons.module.scss';
import {
  fetchCustomAudience,
  fetchCustomAudiencesList,
  fetchDefaultAudience,
  fetchDeleteCustomAudience,
} from '../../redux/profile/audienceAsyncActions';
import { setActiveCustomAudience } from '../../redux/profile/slice';
import { setCustomAudience } from '../../redux/posts/slice';
import { selectActivePost } from '../../redux/posts/selectors';

interface ICustomAudienceForm {}

const CustomAudienceForm: React.FC<ICustomAudienceForm> = ({}) => {
  const userProfile = useSelector(selectUserProfile);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const activePost = useSelector(selectActivePost);

  const dispatch = useAppDispatch();

  const isDefaultAudience = userProfile.defaultCustomAudience === userProfile.activeCustomAudience.id;
  const isLoading = userProfile.customAudiencesListStatus === EFetchStatus.PENDING;
  const customAudienceList = userProfile.customAudiencesList.filter(
    (audience) => audience.id !== userProfile.activeCustomAudience.id
  );

  //*=========>FETCH CUSTOMS AUDIENCES LIST
  useEffect(() => {
    dispatch(fetchCustomAudiencesList(userProfile.user.id));
  }, []);

  useEffect(() => {
    if (activePost.customAudience) {
      const audience = userProfile.customAudiencesList.find((a) => a.id === activePost.customAudience);
      if (audience) dispatch(setActiveCustomAudience(audience));
    }
  }, [userProfile.customAudiencesListStatus]);

  const goBack = () => {
    setIsEditing(false);
  };

  const selectCustmAudience = (audience: IAudience) => {
    dispatch(setActiveCustomAudience(audience));
    dispatch(setCustomAudience(audience.id));
  };

  const hendleEditCustmAudience = () => {
    if (userProfile.activeCustomAudience) {
      dispatch(fetchCustomAudience({ customAudience: userProfile.activeCustomAudience }));
    }
    setIsEditing(true);
  };

  const hendleDeleteCustmAudience = () => {
    dispatch(fetchDeleteCustomAudience(userProfile.activeCustomAudience.id));
  };

  const handleCreateNewCustomAudience = () => {
    dispatch(
      setActiveCustomAudience({
        id: -1,
        title: 'Audience ' + (userProfile.customAudiencesList.length + 1),
        audience: 0,
        users: [],
      })
    );
    setIsEditing(true);
  };

  const handleDefaultAudienceClick = () => {
    dispatch(
      fetchDefaultAudience({
        userId: userProfile.user.id,
        defaultCustomAudience: userProfile.activeCustomAudience.id,
      })
    );
  };

  return (
    <div className={styles.root}>
      <p className={styles.root__title}>
        Set custom audience
        {isEditing && (
          <button onClick={goBack}>
            <ReturnBackSvg />
            Go Back
          </button>
        )}
      </p>
      <div className={styles.root__body}>
        <div className={classNames(styles.root__listBody, isEditing && styles.active)}>
          <div className={styles.root__audience}>
            <div className={styles.root__selectedAudience}>
              {userProfile.activeCustomAudience.id >= 0 && (
                <>
                  <CustomAudienceRow
                    audience={userProfile.activeCustomAudience}
                    // onClick={() => selectCustmAudience(selectedCustomAudience)}
                  />
                  <div className={classNames(styles.customAudience__row, styles.customAudience__options)}>
                    <button
                      className={classNames(styles.customAudience__edit, btnStyles.green)}
                      onClick={hendleEditCustmAudience}
                    >
                      <EditSvg />
                    </button>
                    <span></span>
                    <button
                      className={classNames(styles.customAudience__delete, btnStyles.red)}
                      onClick={hendleDeleteCustmAudience}
                    >
                      <DeleteSvg />
                    </button>
                  </div>
                  <div
                    className={classNames(styles.defaultAudience, isDefaultAudience && styles.active)}
                    onClick={!isDefaultAudience ? handleDefaultAudienceClick : undefined}
                  >
                    <span className={styles.defaultAudience__label}>
                      {isDefaultAudience ? 'Default' : 'Make Default'}
                    </span>
                  </div>
                </>
              )}
            </div>
            <ScrollArea>
              {isLoading ? (
                <Loader size={100} height={100} />
              ) : userProfile.customAudiencesList.length > 0 ? (
                customAudienceList.map((customAudience) => (
                  <CustomAudienceRow
                    key={customAudience.id}
                    audience={customAudience}
                    onClick={() => selectCustmAudience(customAudience)}
                  />
                ))
              ) : (
                <p className={styles.root__empty}>No custom audience</p>
              )}
            </ScrollArea>
            <div className={styles.root__bottom}>
              <button
                className={classNames(styles.createNew, btnStyles.greenDarkSolid)}
                onClick={handleCreateNewCustomAudience}
              >
                Create New
              </button>
            </div>
          </div>
        </div>
        {isEditing && <EditCustomAudience goBack={goBack} />}
      </div>
    </div>
  );
};

export default CustomAudienceForm;
