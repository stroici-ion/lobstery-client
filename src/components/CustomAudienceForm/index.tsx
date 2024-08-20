import React, { useEffect, useState } from 'react';

import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../redux/profile/selectors';
import { IAudience } from '../../models/IAudience';
import Loader from '../Loader';
import { EditSvg, ReturnBackSvg } from '../../icons';
import classNames from 'classnames';

import CustomAudienceRow from './Core/CustomAudienceRow';
import { selectDefaultAudience } from '../../redux/defaultAudience/selectors';
import { useAppDispatch } from '../../redux';
import {
  fetchCustomAudience,
  fetchCustomAudiencesList,
  fetchDefaultAudience,
  fetchDeleteCustomAudience,
} from '../../redux/defaultAudience/asyncActions';
import DeleteSvg from '../../icons/DeleteSvg';
import EditCustomAudience from './Core/EditCustomAudience';
import { setActiveCustomAudience } from '../../redux/defaultAudience/slice';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

interface ICustomAudienceForm {}

const CustomAudienceForm: React.FC<ICustomAudienceForm> = ({}) => {
  // const defaultAudiences = useSelector();
  const userId = useSelector(selectUserProfile).id;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const defaultAudience = useSelector(selectDefaultAudience);
  const isDefaultAudience =
    defaultAudience.default_custom_audience === defaultAudience.activeCustomAudience.id;
  const isLoading = defaultAudience.customAudiencesListStatus === FetchStatusEnum.PENDING;
  const customAudienceList = defaultAudience.customAudiencesList.filter(
    (audience) => audience.id !== defaultAudience.activeCustomAudience.id
  );

  //*=========>FETCH CUSTOMS AUDIENCES LIST
  useEffect(() => {
    dispatch(fetchCustomAudiencesList(userId));
  }, []);

  const goBack = () => {
    setIsEditing(false);
  };

  const selectCustmAudience = (audience: IAudience) => {
    dispatch(setActiveCustomAudience(audience));
  };

  const hendleEditCustmAudience = () => {
    if (defaultAudience.activeCustomAudience) {
      dispatch(fetchCustomAudience({ customAudience: defaultAudience.activeCustomAudience }));
    }
    setIsEditing(true);
  };

  const hendleDeleteCustmAudience = () => {
    dispatch(fetchDeleteCustomAudience({ customAudience: defaultAudience.activeCustomAudience }));
  };

  const handleCreateNewCustomAudience = () => {
    dispatch(
      setActiveCustomAudience({
        id: -1,
        title: 'Audience ' + (defaultAudience.customAudiencesList.length + 1),
        audience: 0,
        audience_list: [],
      })
    );
    setIsEditing(true);
  };

  const handleDefaultAudienceClick = () => {
    dispatch(
      fetchDefaultAudience({
        userId,
        default_custom_audience: defaultAudience.activeCustomAudience.id,
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
              {defaultAudience.activeCustomAudience.id >= 0 && (
                <>
                  <CustomAudienceRow
                    audience={defaultAudience.activeCustomAudience}
                    // onClick={() => selectCustmAudience(selectedCustomAudience)}
                  />
                  <div
                    className={classNames(
                      styles.customAudience__row,
                      styles.customAudience__options
                    )}
                  >
                    <button
                      className={styles.customAudience__edit}
                      onClick={hendleEditCustmAudience}
                    >
                      <EditSvg />
                    </button>
                    <span></span>
                    <button
                      className={styles.customAudience__delete}
                      onClick={hendleDeleteCustmAudience}
                    >
                      <DeleteSvg />
                    </button>
                  </div>
                  <div
                    className={classNames(
                      styles.defaultAudience,
                      isDefaultAudience && styles.active
                    )}
                    onClick={!isDefaultAudience ? handleDefaultAudienceClick : undefined}
                  >
                    <input
                      checked={isDefaultAudience}
                      className={styles.defaultAudience__checkbox}
                      type="checkbox"
                    />
                    <span className={styles.defaultAudience__label}>Default</span>
                  </div>
                </>
              )}
            </div>
            <div className={styles.root__list}>
              <div className={styles.root__scrollArea}>
                {isLoading ? (
                  <Loader size={100} height={100} />
                ) : defaultAudience.customAudiencesList.length > 0 ? (
                  customAudienceList.map((customAudience) => (
                    <CustomAudienceRow
                      audience={customAudience}
                      onClick={() => selectCustmAudience(customAudience)}
                    />
                  ))
                ) : (
                  <p className={styles.root__empty}>No custom audience</p>
                )}
              </div>
            </div>
            <div className={styles.root__bottom}>
              <button className={styles.createNew} onClick={handleCreateNewCustomAudience}>
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
