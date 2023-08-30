import { AppState } from "src/app/app.state";
import { State } from "../reducers/settings.reducer";
import { createSelector } from "@ngrx/store";


export const selectSettingsState = (state: AppState): State => state.settings;

export const selectSettingsAppData = createSelector(
  selectSettingsState,
  ({appData}: State) => appData
);

export const selectSettingsIsFetching = createSelector(
  selectSettingsState,
  ({isFetching}: State) => isFetching
);

export const selectSettingsHasError = createSelector(
  selectSettingsState,
  ({hasError}: State) => hasError
);
