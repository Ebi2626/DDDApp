import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Target } from '../models/targets.model';

export interface PopupState {
  isOpen: boolean;
  target?: Target;
}

@Injectable({
  providedIn: 'root'
})
export class TargetModalService {

  modalState$: Subject<PopupState> = new Subject<PopupState>();

  constructor() { }

  toggleScrollbar() {
    const body = document.querySelector('body');
    const hiddenScrollbarClass = 'modal-open';
    body?.classList.toggle(hiddenScrollbarClass);

  }

  openModal(target?: Target) {
    this.toggleScrollbar();
    console.log('target in service: ', target);
    this.modalState$.next({
      isOpen: true,
      ...(target ? { target } : {}),
    });
  }

  closeModal() {
    this.toggleScrollbar();
    this.modalState$.next({ isOpen: false });
  }
}
