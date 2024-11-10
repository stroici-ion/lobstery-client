import { IAudience } from '../../models/audience/IAudience';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export interface IDefaultAudienceState {
  defaultAudience: number;
  defaultCustomAudience: number;
  customAudiencesCount: number;
  activeCustomAudience: IAudience;
  defaultAudienceStatus: FetchStatusEnum;
  customAudienceStatus: FetchStatusEnum;
  customAudiencesListStatus: FetchStatusEnum;
  customAudiencesList: IAudience[];
}
