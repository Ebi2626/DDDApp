import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from '../actions/settings.actions';
import { DEFAULT_COLORS_ARRAY, Settings } from 'dddapp-common';

export interface State {
  userData: {
    categories: number;
    tasks: number;
    targets: number;
  };
  settings: Settings;
  isFetching: boolean;
  hasError: boolean;
}

export const initialState: State = {
  userData: {
    categories: 0,
    targets: 0,
    tasks: 0,
  },
  settings: {
    colors: DEFAULT_COLORS_ARRAY,
    notificationTime: {
      hour: 12,
      minute: 0,
    },
  },
  isFetching: false,
  hasError: false,
};

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.fetchUserData, (state) => ({
    ...state,
    isFetching: true,
    hasError: false,
  })),
  on(SettingsActions.fetchUserDataSuccessfull, (state, { userData }) => ({
    ...state,
    userData,
    isFetching: false,
  })),
  on(SettingsActions.fetchUserDataFailed, (state) => ({
    ...state,
    hasError: true,
    isFetching: false,
  })),
  on(SettingsActions.fetchUserSettings, (state) => ({
    ...state,
    isFetching: true,
    hasError: false,
  })),
  on(SettingsActions.fetchUserSettingsSuccessfull, (state, { settings }) => ({
    ...state,
    settings,
    isFetching: false,
  })),
  on(SettingsActions.fetchUserSettingsFailed, (state) => ({
    ...state,
    hasError: true,
    isFetching: false,
  })),
  on(SettingsActions.updateUserSettings, (state) => ({
    ...state,
    hasError: false,
    isFetching: true,
  })),
  on(SettingsActions.updateUserSettingsSuccessfull, (state, { settings }) => ({
    ...state,
    settings,
  })),
  on(SettingsActions.updateUserSettingsFailed, (state) => ({
    ...state,
    hasError: true,
    isFetching: false,
  }))
);
