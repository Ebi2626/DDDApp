import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Category } from 'dddapp-common';

export interface PopupState {
  isOpen: boolean;
  category?: Category;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesModalService {

  modalState$: Subject<PopupState> = new Subject<PopupState>();

  constructor() { }

  toggleScrollbar() {
    const body = document.querySelector('body');
    const hiddenScrollbarClass = 'modal-open';
    body?.classList.toggle(hiddenScrollbarClass);

  }

  public openModal(category?: Category) {
    this.toggleScrollbar();
    this.modalState$.next({
      isOpen: true,
      ...(category ? { category } : {}),
    });
  }

  closeModal() {
    this.toggleScrollbar();
    this.modalState$.next({ isOpen: false });
  }
}
