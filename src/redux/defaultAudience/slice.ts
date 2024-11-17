import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAudience, ICustomAudiences, IDefaultAudience, IDefaultAudienceState } from './types';
import { EFetchStatus } from '../../types/enums';
import {
  fetchCustomAudience,
  fetchCustomAudiencesList,
  fetchDefaultAudience,
  fetchDeleteCustomAudience,
} from './asyncActions';
import { IUser } from '../profile/types';

const initialState: IDefaultAudienceState = {
  defaultAudience: -1,
  defaultCustomAudience: -1,
  customAudiencesCount: 0,
  customAudiencesList: [],
  activeCustomAudience: {
    id: -1,
    title: '',
    audience: 0,
    users: [],
  },

  //status
  defaultAudienceStatus: EFetchStatus.PENDING,
  customAudienceStatus: EFetchStatus.PENDING,
  customAudiencesListStatus: EFetchStatus.PENDING,
};

const audience = createSlice({
  name: 'audience',
  initialState,
  reducers: {
    setDefaultAudience: (state, action: PayloadAction<number>) => {
      state.defaultAudience = action.payload;
    },
    setDefaultCustomAudience: (state, action: PayloadAction<number>) => {
      state.defaultCustomAudience = action.payload;
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
      state.activeCustomAudience.users = [...state.activeCustomAudience.users, action.payload];
    },
    removeActiveCustomAudienceFriend: (state, action: PayloadAction<number>) => {
      state.activeCustomAudience.users = state.activeCustomAudience.users.filter((user) => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    //*DEFAULT AUDIENCE
    builder.addCase(fetchDefaultAudience.pending, (state) => {
      state.defaultAudienceStatus = EFetchStatus.PENDING;
    });
    builder.addCase(fetchDefaultAudience.fulfilled, (state, action: PayloadAction<IDefaultAudience>) => {
      state.defaultCustomAudience = action.payload.defaultCustomAudience;
      state.defaultAudience = action.payload.defaultAudience;
      state.defaultAudienceStatus = EFetchStatus.SUCCESS;
    });
    builder.addCase(fetchDefaultAudience.rejected, (state) => {
      state.defaultAudienceStatus = EFetchStatus.ERROR;
    });

    //*CUSTOM AUDIENCE
    builder.addCase(fetchCustomAudience.pending, (state) => {
      state.customAudienceStatus = EFetchStatus.PENDING;
    });
    builder.addCase(fetchCustomAudience.fulfilled, (state, action: PayloadAction<IAudience>) => {
      state.activeCustomAudience = action.payload;
      const candidate = state.customAudiencesList.find((audience) => audience.id === action.payload.id);
      if (candidate) {
        state.customAudiencesList = state.customAudiencesList.map((audience) =>
          audience.id === candidate.id ? action.payload : audience
        );
      } else {
        state.customAudiencesList = [action.payload, ...state.customAudiencesList];
      }
      state.customAudienceStatus = EFetchStatus.SUCCESS;
    });
    builder.addCase(fetchCustomAudience.rejected, (state) => {
      state.customAudienceStatus = EFetchStatus.ERROR;
    });

    //*CUSTOM AUDIENCE DELETE
    builder.addCase(fetchDeleteCustomAudience.pending, (state) => {
      state.customAudienceStatus = EFetchStatus.PENDING;
    });
    builder.addCase(fetchDeleteCustomAudience.fulfilled, (state, action: PayloadAction<IDefaultAudience>) => {
      state.defaultAudience = action.payload.defaultAudience;
      state.defaultCustomAudience = action.payload.defaultCustomAudience;
      state.customAudiencesList = state.customAudiencesList.filter(
        (audience) => audience.id !== state.activeCustomAudience.id
      );
      state.activeCustomAudience = {
        id: -1,
        title: '',
        audience: 0,
        users: [],
      };
      state.customAudienceStatus = EFetchStatus.SUCCESS;
    });
    builder.addCase(fetchDeleteCustomAudience.rejected, (state) => {
      state.customAudienceStatus = EFetchStatus.ERROR;
    });

    //*CUSTOM AUDIENCE LIST
    builder.addCase(fetchCustomAudiencesList.pending, (state) => {
      state.customAudiencesListStatus = EFetchStatus.PENDING;
    });
    builder.addCase(fetchCustomAudiencesList.fulfilled, (state, action: PayloadAction<ICustomAudiences>) => {
      state.customAudiencesCount = action.payload.count;
      state.customAudiencesList = action.payload.results;

      //* SET ACTIVE AUDIENCE BY DEFAULT
      const candidate = state.customAudiencesList.find((audience) => audience.id === state.defaultCustomAudience);
      if (candidate) state.activeCustomAudience = candidate;
      state.customAudiencesListStatus = EFetchStatus.SUCCESS;
    });
    builder.addCase(fetchCustomAudiencesList.rejected, (state) => {
      state.customAudiencesListStatus = EFetchStatus.ERROR;
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
