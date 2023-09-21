import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as SettingsActions from '../../actions/settings.actions';
import { Color, Settings } from 'dddapp-common';

export enum COLOR_VARIABLES {
  PRIMARY = 'primary',
  PRIMARY_60 = 'primary-60',
  SECONDARY = 'secondary',
  BG_COLOR = 'bg-color',
  TEXT_COLOR = 'text-color',
}

export enum DEFAULT_COLORS {
  PRIMARY = '#19647e',
  PRIMARY_60 = '#19657e66',
  SECONDARY = '#28afb0',
  BG_COLOR = '#1f1f28',
  TEXT_COLOR = '#ffffff',
}

export const DEFAULT_COLOR_LABELS = {
  prmiary: 'Kolor główny: ',
  secondary: 'Kolor wyróżniony: ',
  'bg-color': 'Kolor tła: ',
  'text-color': 'Kolor tekstu: ',
};

export interface UserData {
  targets: number;
  tasks: number;
  categories: number;
}

@Component({
  selector: 'dddapp-app-data[settings]',
  templateUrl: './app-data.component.html',
  styleUrls: ['./app-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDataComponent implements OnInit {
  COLOR_VARIABLES = COLOR_VARIABLES;
  DEFAULT_COLORS = DEFAULT_COLORS;
  DEFAULT_COLOR_LABELS = DEFAULT_COLOR_LABELS;
  private _settings!: Settings;

  @Output()
  updatedSettings: EventEmitter<Settings> = new EventEmitter<Settings>();

  @Input()
  set settings(newSettings: Settings) {
    this._settings = newSettings;
  }

  get settings() {
    return this._settings;
  }

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(SettingsActions.fetchUserSettings());
  }

  changeColor(color: Color) {
    const colors = this.settings.colors.map((oldColor, i) =>
      oldColor.colorId === color.colorId ? color : oldColor
    );
    const updatedSettings = {
      ...this.settings,
      colors,
    };
    this.updatedSettings.emit(updatedSettings);
  }
}
