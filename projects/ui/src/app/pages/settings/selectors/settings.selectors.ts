import { AppState } from 'src/app/app.state';
import { State } from '../reducers/settings.reducer';
import { createSelector } from '@ngrx/store';

export const selectSettingsState = (state: AppState): State => state.settings;

export const selectUserData = createSelector(
  selectSettingsState,
  ({ userData }: State) => userData
);

export const selectSettingsIsFetching = createSelector(
  selectSettingsState,
  ({ isFetching }: State) => isFetching
);

export const selectSettingsHasError = createSelector(
  selectSettingsState,
  ({ hasError }: State) => hasError
);

export const selectUserSettings = createSelector(
  selectSettingsState,
  ({ settings }: State) => settings
);
