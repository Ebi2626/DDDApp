import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GlobalSpinnerService } from './components/global-spinner/global-spinner.service';

@Component({
  selector: 'dddapp-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
  isFetching: boolean = false;
  private sub: Subscription = new Subscription();

  constructor(
    private globalSpinnerService: GlobalSpinnerService
  ) {
    this.sub.add(
      this.globalSpinnerService.show$.subscribe((isShown) => this.isFetching = isShown)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
