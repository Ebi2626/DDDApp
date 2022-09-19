import { Directive, ElementRef, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Directive({
  selector: '[dddaResolution]'
})
export class ResolutionDirective implements OnInit, OnDestroy {

  private _widthChange$: Subject<number> = new Subject();

  private _screenWidth!: number;
  set screenWidth(width: number) {
    this._screenWidth = width;
  };
  get screenWidth(): number {
    return this._screenWidth;
  }

  @Output()
  onWindowWidthChange: EventEmitter<number> = new EventEmitter();

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this._widthChange$.next((event.target as Window).innerWidth);
  }

  constructor() {
    this._widthChange$.pipe(debounceTime(200)).subscribe(
      (newScreenWidth: number) => {
        this.screenWidth = newScreenWidth;
        this.onWindowWidthChange.emit(newScreenWidth);
      }
    );
  }

  ngOnDestroy(): void {
    this._widthChange$.unsubscribe();
  }

  ngOnInit() {
    this._widthChange$.next(window.innerWidth);
  }

}
