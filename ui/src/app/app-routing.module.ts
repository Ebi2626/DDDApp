import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { WelcomeGuard } from './guard/welcome.guard';
import { CategoriesComponent } from './pages/categories/categories.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TargetsComponent } from './pages/targets/targets.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { WelcomePageComponent } from './pages/welcome/welcome-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/welcome',
  },
  {
    path: 'welcome',
    component: WelcomePageComponent,
    canActivate: [WelcomeGuard],
    data: { customLayout: true },
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'targets',
    component: TargetsComponent,
  },
  {
    path: 'tasks',
    component: TasksComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, WelcomeGuard],
})
export class AppRoutingModule { }
