import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppState } from './app.state';
import { Store } from '@ngrx/store';
import * as SettingsActions from './pages/settings/actions/settings.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  hasCustomLayout: boolean = false;

  constructor(private router: Router, private store: Store<AppState>) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const route = this.router.routerState.snapshot.root.firstChild;
        if (route?.data['customLayout']) {
          this.hasCustomLayout = true;
        } else {
          this.hasCustomLayout = false;
        }
      });
  }

  ngAfterViewInit() {
    console.log('dispatchujemy akcje');
    this.store.dispatch(SettingsActions.fetchUserSettings());
  }
}
