import { createReducer, on } from "@ngrx/store";
import * as SettingsActions from '../actions/settings.actions';


export interface State {
  appData: {
    categories: number;
    tasks: number;
    targets: number;
  }
  isFetching: boolean;
  hasError: boolean;
}

export const initialState: State = {
  appData: {
    categories: 0,
    targets: 0,
    tasks: 0
  },
  isFetching: false,
  hasError: false,
}

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.fetchAppData, (state) => ({
    ...state,
    isFetching: true,
    hasError: false,
  })),
  on(SettingsActions.fetchAppDataSuccessfull, (state, {appData}) => ({
    ...state,
    appData,
    isFetching: false,
  })),
  on(SettingsActions.fetchAppDataFailed, (state) => ({
    ...state,
    hasError: true,
    isFetching: false,
  }))
);
