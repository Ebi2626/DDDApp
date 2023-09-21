import { createAction, props } from '@ngrx/store';
import { Task, Target, Category, Settings } from 'dddapp-common';
import { UserData } from '../components/app-data/app-data.component';

export interface ImportDataFileStructure {
  Categories: Category[];
  Targets: Target[];
  Tasks: Task[];
}

export const importData = createAction(
  '[Settings] Import data request',
  props<{ importedData: ImportDataFileStructure }>()
);

export const importDataSuccessfull = createAction(
  '[Settings] Imported data successfull',
  props<{ importedData: ImportDataFileStructure }>()
);

export const fetchUserData = createAction('[Settings] Fetch user data');

export const fetchUserDataSuccessfull = createAction(
  '[Settings] Fetch user data successfull',
  props<{ userData: UserData }>()
);

export const fetchUserDataFailed = createAction(
  '[Settings] Fetch user data failed'
);

export const fetchUserSettings = createAction('[Settings] Fetch user settings');

export const fetchUserSettingsSuccessfull = createAction(
  '[Settings] Fetch user settings successfull',
  props<{ settings: Settings }>()
);

export const fetchUserSettingsFailed = createAction(
  '[Settings] Fetch user settings failed'
);

export const updateUserSettings = createAction(
  '[Settings] Update user settings',
  props<{ settings: Settings }>()
);

export const updateUserSettingsSuccessfull = createAction(
  '[Settings] Update user settings successfull',
  props<{ settings: Settings }>()
);

export const updateUserSettingsFailed = createAction(
  '[Settings] Update user settings fail'
);
