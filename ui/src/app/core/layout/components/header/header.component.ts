import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ddda-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private _windowWidth!: number;
  set windowWidth(width: number){
    console.log(width);
    this._windowWidth = width;
  }
  get windowWidth(): number {
    return this._windowWidth;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
