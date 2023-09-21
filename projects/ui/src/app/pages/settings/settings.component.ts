import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Settings } from 'dddapp-common';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as SettingsSelectors from './selectors/settings.selectors';
import * as SettingsActions from './actions/settings.actions';

@Component({
  selector: 'dddapp-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  settings$: Observable<Settings>;

  constructor(private store: Store<AppState>) {
    this.settings$ = this.store.select(SettingsSelectors.selectUserSettings);
  }

  updateSettings(newSettings: Settings) {
    this.store.dispatch(
      SettingsActions.updateUserSettings({ settings: newSettings })
    );
  }
}
