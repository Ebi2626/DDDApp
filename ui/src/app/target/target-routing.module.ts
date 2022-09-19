import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TargetPageComponent } from './target-page/target-page.component';

const routes: Routes = [
  {
    path: '',
    component: TargetPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TargetRoutingModule {}
