import { IAudience } from '../../models/IAudience';
import { FetchStatusEnum } from '../../models/response/FetchStatus';

export interface IDefaultAudienceState {
  default_audience: number;
  default_custom_audience: number;
  customAudiencesCount: number;
  activeCustomAudience: IAudience;
  defaultAudienceStatus: FetchStatusEnum;
  customAudienceStatus: FetchStatusEnum;
  customAudiencesListStatus: FetchStatusEnum;
  customAudiencesList: IAudience[];
}
