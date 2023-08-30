import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Page } from 'src/app/core/reducers/query.reducer';

@Component({
  selector: 'dddapp-pagination[page]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Input()
  page!: Page;

  @Output()
  pageChange: EventEmitter<Page> = new EventEmitter<Page>();

  constructor(
    private store: Store<AppState>
  ){
  }

  private getFirstPage(page: Page): number {
    let result = 0;
    if(page.totalPages > 1) {
      if(page.current > 0) {
        if(page.current < page.totalPages - 1) {
          result = page.current - 1;
        } else {
          if(page.current - 2 >= 0) {
            result = page.current - 2;
          } else {
            result = page.current - 1;
          }
        }
      }
    }
    return result;
  }


  getCurrentPages(page: Page): number[] {
    let firstPage = this.getFirstPage(page);
    let middlePage = firstPage + 1 < page.totalPages ? firstPage + 1 : null;
    let lastPage = firstPage + 2 < page.totalPages ? firstPage + 2 : null;
    const pages = [firstPage, middlePage, lastPage];
    return pages.filter((val) => val !== null) as number[];
  }

  previousPage(page: Page) {
    if(page.current - 1 >= 0) {
      this.setCurrentPage(page, page.current - 1);
    }
  }
  setCurrentPage(page: Page, newCurrentPage: number) {
    const newPage: Page = {
      ...page,
      current: newCurrentPage
    };
    if(page.current !== newCurrentPage) {
      this.pageChange.emit(newPage);
    }
  }
  nextPage(page: Page) {
    if(page.current + 1 <= page.totalPages - 1) {
      this.setCurrentPage(page, page.current + 1);
    }
  }
}
