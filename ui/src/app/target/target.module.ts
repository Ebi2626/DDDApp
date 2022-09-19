import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetPageComponent } from './target-page/target-page.component';
import { TargetRoutingModule } from './target-routing.module';

@NgModule({
  declarations: [
    TargetPageComponent
  ],
  imports: [
    CommonModule,
    TargetRoutingModule
  ]
})
export class TargetModule { }
