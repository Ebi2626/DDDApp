import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { TargetModalService } from './pages/targets/services/target-modal.service';
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
import { environment } from 'src/environments/environment';
import { SharedModule } from './shared/shared.module';
import { TargetItemComponent } from './pages/targets/components/target-item/target-item.component';
import { tasksReducer } from './pages/tasks/reducers/tasks.reducer';
import { TasksEffects } from './pages/tasks/effects/tasks.effect';
import { TaskItemComponent } from './pages/tasks/components/task-item/task-item.component';
import { TaskModalComponent } from './pages/tasks/components/task-modal/task-modal.component';
import { TaskListComponent } from './pages/targets/components/task-list/task-list.component';
import { TargetModalComponent } from './pages/targets/components/target-modal/target-modal.component';
import { TargetFormComponent } from './pages/targets/components/target-form/target-form.component';
import '@angular/common/locales/global/pl';
import { AssignTargetsModalComponent } from './pages/targets/components/target-modal/components/assign-targets-modal/assign-targets-modal.component';
import { TaskListRealizationComponent } from './pages/targets/components/task-list-realization/task-list-realization.component';
import { TaskModalService } from './pages/tasks/services/task-modal.service';
import { TaskFormComponent } from './pages/tasks/components/task-form/task-form.component';
import { KeyToIdInterceptor } from './core/interceptors/key-to-id.interceptor';
import { CyclicCompletionsComponent } from './pages/targets/components/task-list-realization/components/cyclic-completions/cyclic-completions.component';
import { TokenService } from './core/services/token.service';
import { SingleCompletionsComponent } from './pages/targets/components/task-list-realization/components/single-completions/single-completions.component';
import { ProgressiveCompletionsComponent } from './pages/targets/components/task-list-realization/components/progressive-completions/progressive-completions.component';
import { DashboardStatisticsComponent } from './pages/dashboard/components/dashboard-statistics/dashboard-statistics.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { TargetListComponent } from './pages/targets/components/target-list/target-list.component';
import { DashboardTargetsComponent } from './pages/dashboard/components/dashboard-targets/dashboard-targets.component';
import { TaskTitleList } from './pages/targets/components/task-title-list/task-title-list.component';
import { categoriesReducer } from './pages/categories/reducers/categories.reducer';
import { CategorieEffects } from './pages/categories/effects/categories.effect';
import { CategoryItemComponent } from './pages/categories/components/category-item/category-item.component';
import { CategoryFormComponent } from './pages/categories/components/category-form/category-form.component';
import { CategoryModalComponent } from './pages/categories/components/category-modal/category-modal.component';
import { CategoriesModalService } from './pages/categories/services/categories-modal.service';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    DashboardPageComponent,
    TargetsComponent,
    TargetListComponent,
    TasksComponent,
    CategoriesComponent,
    SettingsComponent,
    TargetItemComponent,
    TaskItemComponent,
    TaskTitleList,
    TaskModalComponent,
    TaskListComponent,
    TargetModalComponent,
    TargetFormComponent,
    AssignTargetsModalComponent,
    TaskListRealizationComponent,
    TaskFormComponent,
    CyclicCompletionsComponent,
    SingleCompletionsComponent,
    ProgressiveCompletionsComponent,
    DashboardStatisticsComponent,
    DashboardTargetsComponent,
    CategoryItemComponent,
    CategoryFormComponent,
    CategoryModalComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    KeycloakAngularModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    StoreModule.forRoot({
      targets: targetsReducer,
      tasks: tasksReducer,
      categories: categoriesReducer,
    }),
    EffectsModule.forRoot([
      TargetsEffects,
      TasksEffects,
      CategorieEffects,
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 50,
      logOnly: environment.production
    }),
  ],
  providers: [
    TargetModalService,
    TaskModalService,
    CategoriesModalService,
    AuthGuard,
    WelcomeGuard,
    ConfigInitService,
    TokenService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ConfigInitService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: KeyToIdInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
