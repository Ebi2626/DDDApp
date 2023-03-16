import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlComponent } from './components/control/control.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NoDataComponent } from './components/no-data/no-data.component';



@NgModule({
  declarations: [
    ControlComponent,
    SpinnerComponent,
    NoDataComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ControlComponent,
    SpinnerComponent,
    NoDataComponent,
  ]
})
export class SharedModule { }
