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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ListOfLinksComponent } from './components/list-of-links/list-of-links.component';
import { AppRoutingModule } from '../app-routing.module';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { CategoriesSelectorComponent } from './components/categories-selector/categories-selector.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';

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
    ListOfLinksComponent,
    ButtonGroupComponent,
    CategoriesSelectorComponent,
    PaginationComponent,
    ColorPickerComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
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
    ListOfLinksComponent,
    ButtonGroupComponent,
    CategoriesSelectorComponent,
    PaginationComponent,
    ColorPickerComponent,
  ],
})
export class SharedModule {}
