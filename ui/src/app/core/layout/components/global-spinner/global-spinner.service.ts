import { Injectable } from "@angular/core";
import { Subject, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalSpinnerService {

  show$: Subject<boolean> = new Subject<boolean>();

  constructor(
  ) {
    this.show$.pipe(
      tap((data) => { console.log('isPopupShown: ', data) })
    )
  }
}