import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Color } from 'dddapp-common';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'dddapp-color-picker[color]',
  templateUrl: './color-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  private _sub: Subscription = new Subscription();

  @Input()
  color!: Color;

  choosenValue: string = this.color?.color || this.color?.defaultValue;
  choosenValue$: Subject<string> = new Subject();

  ngOnInit(): void {
    this._sub.add(
      this.choosenValue$
        .pipe(debounceTime(500))
        .subscribe((newColor: string) => {
          this.color = {
            ...this.color,
            color: newColor,
          };
          this.choosenColor.emit(this.color);
        })
    );
  }

  ngAfterViewInit() {
    this.choosenValue = this.color?.color || this.color?.defaultValue;
    this.cdr.detectChanges();
  }

  @Output()
  choosenColor: EventEmitter<Color> = new EventEmitter<Color>();
}
