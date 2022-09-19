import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routes } from 'src/app/app-routing.module';
import { MOBILE_MENU_BREAKPOINT } from '../../layout/models';

@Component({
  selector: 'ddda-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public mobileMenuBreakopiont: number = MOBILE_MENU_BREAKPOINT;

  @Input()
  windowWidth!: number;

  public links = routes;

  constructor(public route: ActivatedRoute) {
   }

  ngOnInit(): void {
  }

}
