import { Component, Input } from '@angular/core';

export interface LinkProperties {
  id: string;
  title: string;
}

export interface LinkInterface extends LinkProperties {
  [key: string]: any,
};

@Component({
  selector: 'dddapp-list-of-links[list][routerArray]',
  templateUrl: './list-of-links.component.html',
  styleUrls: ['./list-of-links.component.scss']
})
export class ListOfLinksComponent {
  @Input() list!: LinkInterface[];
  @Input() routerArray!: string[];
  @Input() noDataText: string = '';

  isFetching: boolean = false;
}
