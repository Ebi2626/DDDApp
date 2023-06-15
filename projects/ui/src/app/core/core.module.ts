import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './layout/components/navbar/navbar.component';
import { FooterComponent } from './layout/components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { GlobalSpinnerComponent } from './layout/components/global-spinner/global-spinner.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [LayoutComponent, NavbarComponent, FooterComponent, GlobalSpinnerComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
  ],
  exports: [LayoutComponent],
})
export class CoreModule { }
