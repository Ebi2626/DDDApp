import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalSpinnerService } from './global-spinner.service';

@Component({
  selector: 'dddapp-global-spinner',
  templateUrl: './global-spinner.component.html',
  styleUrls: ['./global-spinner.component.scss'],
})
export class GlobalSpinnerComponent implements OnDestroy {

  show: boolean = false;
  private sub: Subscription = new Subscription();

  constructor(private globalSpinnerService: GlobalSpinnerService) {
    this.sub.add(
      globalSpinnerService.show$.subscribe((show) => show = show)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
