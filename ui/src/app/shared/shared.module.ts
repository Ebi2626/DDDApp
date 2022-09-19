import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResolutionDirective } from './directives/resolution.directive';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Window } from '@popperjs/core';

@NgModule({
  declarations: [
    ResolutionDirective
  ],
  imports: [
    CommonModule, FormsModule, NgbModule
  ],
  exports: [
    ResolutionDirective,
  ],
  providers: [
    Window
  ]
})
export class SharedModule { }
