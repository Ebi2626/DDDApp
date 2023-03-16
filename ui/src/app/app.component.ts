import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  hasCustomLayout: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const route = this.router.routerState.snapshot.root.firstChild;

        if (route && route.data['customLayout']) {
          this.hasCustomLayout = true
        } else {
          this.hasCustomLayout = false;
        }
      });
  }
}
