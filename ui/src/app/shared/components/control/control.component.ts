import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ddda-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  @Input()
  name!: string;

  @Input()
  type!: HTMLInputElement['type'];

  @Input()
  label!: string;

  @Input()
  placeholder?: string;


  constructor() { }

  ngOnInit(): void {
  }

}
