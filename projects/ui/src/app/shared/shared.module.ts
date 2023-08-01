import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlComponent } from './components/control/control.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { TaskTypePipe } from './pipes/task-type.pipe';
import { VerificationMethodPipe } from './pipes/verification-method.pipe';
import { PeriodToTextPipe } from './pipes/period-to-text.pipe';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { SelectListComponent } from './components/select-list/select-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownComponent } from './components/dropdown/dropdown.component';



@NgModule({
  declarations: [
    ControlComponent,
    SpinnerComponent,
    NoDataComponent,
    TaskTypePipe,
    VerificationMethodPipe,
    PeriodToTextPipe,
    LineChartComponent,
    BarChartComponent,
    SelectListComponent,
    DropdownComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ControlComponent,
    SpinnerComponent,
    NoDataComponent,
    BarChartComponent,
    LineChartComponent,
    TaskTypePipe,
    VerificationMethodPipe,
    PeriodToTextPipe,
    SelectListComponent,
    DropdownComponent,
  ]
})
export class SharedModule { }
