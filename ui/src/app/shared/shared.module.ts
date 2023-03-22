import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlComponent } from './components/control/control.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { TaskTypePipe } from './pipes/task-type.pipe';
import { VerificationMethodPipe } from './pipes/verification-method.pipe';



@NgModule({
  declarations: [
    ControlComponent,
    SpinnerComponent,
    NoDataComponent,
    TaskTypePipe,
    VerificationMethodPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ControlComponent,
    SpinnerComponent,
    NoDataComponent,
    TaskTypePipe,
    VerificationMethodPipe
  ]
})
export class SharedModule { }
