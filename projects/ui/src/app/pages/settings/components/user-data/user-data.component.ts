import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as SettingsActions from '../../actions/settings.actions';
import * as SettingsSelectors from '../../selectors/settings.selectors';
import * as R from 'ramda';
import { BehaviorSubject, Observable, Subscription, debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { UserData } from '../app-data/app-data.component';

export const collectionsToExport: string[] = ['Categories', 'Targets', 'Tasks'];

@Component({
  selector: 'dddapp-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
})
export class UserDataComponent implements OnInit {
  private _sub: Subscription = new Subscription();
  userData$: Observable<UserData>;
  isFetching$: Observable<boolean>;
  hasError$: Observable<boolean>;

  @Input()
  notificationHour!: number;

  newNotificationHour$: BehaviorSubject<number> = new BehaviorSubject(this.notificationHour);

  @Output()
  newNotificationHour: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private dataService: DataService,
    private store: Store<AppState>
  ) {
    this.userData$ = this.store.select(SettingsSelectors.selectUserData);
    this.isFetching$ = this.store.select(
      SettingsSelectors.selectSettingsIsFetching
    );
    this.hasError$ = this.store.select(
      SettingsSelectors.selectSettingsHasError
    );
  }

  export() {
    this.dataService.export().subscribe((response) => {
      const dataWithoutKeys = R.replace('_key', 'id', JSON.stringify(response));
      const blob = new Blob([JSON.stringify(dataWithoutKeys)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dddapp-data.json';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  importJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    input.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target?.files?.length) {
        const file = target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const importedData = JSON.parse(e.target.result);
            const error = this.validateImportedJson(importedData);
            if (error === null) {
              this.store.dispatch(SettingsActions.importData({ importedData }));
            } else {
              throw new Error(error);
            }
          };
          reader.readAsText(file);
        }
      }
    });

    document.body.appendChild(input);
    input.click(); // This triggers the file selection dialog
    document.body.removeChild(input); // Remove the input element after use
  }

  validateImportedJson(imported: Object): string | null {
    const keys = Object.keys(imported);
    if (keys.length > collectionsToExport.length) {
      return 'Too many collections to import';
    }
    const eachCollcetionPresent = collectionsToExport.every((collection) =>
      keys.includes(collection)
    );
    return eachCollcetionPresent
      ? null
      : 'There is not all expected collections in the file.';
  }

  ngOnInit() {
    this.store.dispatch(SettingsActions.fetchUserData());
    this._sub.add(
      this.newNotificationHour$.pipe(
        skip(1),
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((newNotificationHour) => {
        this.newNotificationHour.emit(newNotificationHour);
      })
    )
  }

  ngOnDestroy() {
    this._sub?.unsubscribe();
  }
}
