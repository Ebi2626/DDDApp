import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './guard/auth.guard';
import { WelcomeGuard } from './guard/welcome.guard';
import { ConfigInitService } from './init/config-init.service';
import { initializeKeycloak } from './init/keycloak-init.factory';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { WelcomePageComponent } from './pages/welcome/welcome-page.component';
import { TargetsComponent } from './pages/targets/targets.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TargetsEffects } from './pages/targets/effects/targets.effect';
import { targetsReducer } from './pages/targets/reducers/targets.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppState } from './app.state';
import { environment } from 'src/environments/environment';
import { SharedModule } from './shared/shared.module';
import { GlobalSpinnerService } from './core/layout/components/global-spinner/global-spinner.service';
import { TargetItemComponent } from './pages/targets/components/target-item/target-item.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    DashboardPageComponent,
    TargetsComponent,
    TasksComponent,
    CategoriesComponent,
    SettingsComponent,
    TargetItemComponent,
  ],
  imports: [
    KeycloakAngularModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    StoreModule.forRoot({
      targets: targetsReducer,
    }),
    EffectsModule.forRoot([TargetsEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 50,
      logOnly: environment.production
    }),
  ],
  providers: [
    AuthGuard,
    WelcomeGuard,
    ConfigInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ConfigInitService],
    },
    GlobalSpinnerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
