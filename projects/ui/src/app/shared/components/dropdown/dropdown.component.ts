import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'dddapp-dropdown[label]',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {

  @Input()
  label!: string;

  isOpen: boolean = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.cdr.detectChanges();
  }

  // @ts-ignore
  private unlistener: () => void;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
     ) {}

  ngOnInit() {
    this.unlistener = this.renderer.listen('document', 'click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if(this.isOpen){
        if(this.el.nativeElement.contains(target) === false || target.classList.contains('dropdown')){
          this.toggleDropdown();
        }
      }
      return true;
    })
  }

  ngOnDestroy() {
    this.unlistener();
  }

}
