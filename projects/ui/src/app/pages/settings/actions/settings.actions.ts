import { createAction, props } from '@ngrx/store';
import { Task, Target, Category } from 'dddapp-common';
import { AppData } from '../components/app-data/app-data.component';

export interface ImportDataFileStructure {
  Categories: Category[],
  Targets: Target[],
  Tasks: Task[],
}

export const importData = createAction(
  '[Settings] Import data request',
  props<{ importedData: ImportDataFileStructure }>()
);

export const importDataSuccessfull = createAction(
  '[Settings] Imported data successfull',
  props<{ importedData: ImportDataFileStructure }>()
);

export const fetchAppData = createAction(
  '[Settings] Fetch app data'
);

export const fetchAppDataSuccessfull = createAction(
  '[Settings] Fetch app data successfull',
  props<{ appData: AppData }>()
);

export const fetchAppDataFailed = createAction(
  '[Settings] Fetch app data failed'
);


