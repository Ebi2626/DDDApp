import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';


export interface AppData {
  targets: number;
  tasks: number;
  categories: number;
}

@Component({
  selector: 'dddapp-app-data',
  templateUrl: './app-data.component.html',
  styleUrls: ['./app-data.component.scss']
})
export class AppDataComponent implements OnInit {


  constructor(private store: Store<AppState>){

  }

  ngOnInit() {
  }

}
