import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDefaultAudienceState } from './types';
import { FetchStatusEnum } from '../../models/response/FetchStatus';
import {
  fetchCustomAudience,
  fetchCustomAudiencesList,
  fetchDefaultAudience,
  fetchDeleteCustomAudience,
} from './asyncActions';
import { IAudience, IDefaultAudience } from '../../models/IAudience';
import { IUser } from '../../models/IUser';
import { IFetchCustomAudiencesList } from '../../models/response/FetchDefaultAudienceResponse';

const initialState: IDefaultAudienceState = {
  default_audience: -1,
  default_custom_audience: -1,
  customAudiencesCount: 0,
  customAudiencesList: [],
  activeCustomAudience: {
    id: -1,
    title: '',
    audience: 0,
    audience_list: [],
  },

  //status
  defaultAudienceStatus: FetchStatusEnum.PENDING,
  customAudienceStatus: FetchStatusEnum.PENDING,
  customAudiencesListStatus: FetchStatusEnum.PENDING,
};

const audience = createSlice({
  name: 'audience',
  initialState,
  reducers: {
    setDefaultAudience: (state, action: PayloadAction<number>) => {
      state.default_audience = action.payload;
    },
    setDefaultCustomAudience: (state, action: PayloadAction<number>) => {
      state.default_custom_audience = action.payload;
    },
    setActiveCustomAudience: (state, action: PayloadAction<IAudience>) => {
      state.activeCustomAudience = action.payload;
    },
    setActiveCustomAudienceTitle: (state, action: PayloadAction<string>) => {
      state.activeCustomAudience.title = action.payload;
    },
    setActiveCustomAudienceType: (state, action: PayloadAction<number>) => {
      state.activeCustomAudience.audience = action.payload;
    },
    addActiveCustomAudienceFriend: (state, action: PayloadAction<IUser>) => {
      state.activeCustomAudience.audience_list = [
        ...state.activeCustomAudience.audience_list,
        action.payload,
      ];
    },
    removeActiveCustomAudienceFriend: (state, action: PayloadAction<number>) => {
      state.activeCustomAudience.audience_list = state.activeCustomAudience.audience_list.filter(
        (friend) => friend.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    //*DEFAULT AUDIENCE
    builder.addCase(fetchDefaultAudience.pending, (state) => {
      state.defaultAudienceStatus = FetchStatusEnum.PENDING;
    });
    builder.addCase(
      fetchDefaultAudience.fulfilled,
      (state, action: PayloadAction<IDefaultAudience>) => {
        state.default_custom_audience = action.payload.default_custom_audience;
        state.default_audience = action.payload.default_audience;
        state.defaultAudienceStatus = FetchStatusEnum.SUCCESS;
      }
    );
    builder.addCase(fetchDefaultAudience.rejected, (state) => {
      state.defaultAudienceStatus = FetchStatusEnum.ERROR;
    });

    //*CUSTOM AUDIENCE
    builder.addCase(fetchCustomAudience.pending, (state) => {
      state.customAudienceStatus = FetchStatusEnum.PENDING;
    });
    builder.addCase(fetchCustomAudience.fulfilled, (state, action: PayloadAction<IAudience>) => {
      state.activeCustomAudience = action.payload;
      const candidate = state.customAudiencesList.find(
        (audience) => audience.id === action.payload.id
      );
      if (candidate) {
        state.customAudiencesList = state.customAudiencesList.map((audience) =>
          audience.id === candidate.id ? action.payload : audience
        );
      } else {
        state.customAudiencesList = [action.payload, ...state.customAudiencesList];
      }
      state.customAudienceStatus = FetchStatusEnum.SUCCESS;
    });
    builder.addCase(fetchCustomAudience.rejected, (state) => {
      state.customAudienceStatus = FetchStatusEnum.ERROR;
    });

    //*CUSTOM AUDIENCE DELETE
    builder.addCase(fetchDeleteCustomAudience.pending, (state) => {
      state.customAudienceStatus = FetchStatusEnum.PENDING;
    });
    builder.addCase(
      fetchDeleteCustomAudience.fulfilled,
      (state, action: PayloadAction<IAudience>) => {
        state.customAudiencesList = state.customAudiencesList.filter(
          (audience) => audience.id !== state.activeCustomAudience.id
        );
        state.activeCustomAudience = {
          id: -1,
          title: '',
          audience: 0,
          audience_list: [],
        };
        state.customAudienceStatus = FetchStatusEnum.SUCCESS;
      }
    );
    builder.addCase(fetchDeleteCustomAudience.rejected, (state) => {
      state.customAudienceStatus = FetchStatusEnum.ERROR;
    });

    //*CUSTOM AUDIENCE LIST
    builder.addCase(fetchCustomAudiencesList.pending, (state) => {
      state.customAudiencesListStatus = FetchStatusEnum.PENDING;
    });
    builder.addCase(
      fetchCustomAudiencesList.fulfilled,
      (state, action: PayloadAction<IFetchCustomAudiencesList>) => {
        state.customAudiencesCount = action.payload.count;
        state.customAudiencesList = action.payload.results;

        //* SET ACTIVE AUDIENCE BY DEFAULT
        const candidate = state.customAudiencesList.find(
          (audience) => audience.id === state.default_custom_audience
        );
        if (candidate) state.activeCustomAudience = candidate;
        state.customAudiencesListStatus = FetchStatusEnum.SUCCESS;
      }
    );
    builder.addCase(fetchCustomAudiencesList.rejected, (state) => {
      state.customAudiencesListStatus = FetchStatusEnum.ERROR;
    });
  },
});

export const {
  setDefaultAudience,
  setDefaultCustomAudience,
  setActiveCustomAudience,
  setActiveCustomAudienceTitle,
  setActiveCustomAudienceType,
  addActiveCustomAudienceFriend,
  removeActiveCustomAudienceFriend,
} = audience.actions;

export default audience.reducer;
