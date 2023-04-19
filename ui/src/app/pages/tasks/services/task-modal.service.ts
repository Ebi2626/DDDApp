import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../models/tasks.models';

export interface PopupState {
  isOpen: boolean;
  task?: Task;
}

@Injectable({
  providedIn: 'root'
})
export class TaskModalService {

  modalState$: Subject<PopupState> = new Subject<PopupState>();

  constructor() { }

  toggleScrollbar() {
    const body = document.querySelector('body');
    const hiddenScrollbarClass = 'modal-open';
    body?.classList.toggle(hiddenScrollbarClass);
  }

  public openModal(task?: Task) {
    this.toggleScrollbar();
    this.modalState$.next({
      isOpen: true,
      ...(task ? { task } : {}),
    });
  }

  closeModal() {
    this.toggleScrollbar();
    this.modalState$.next({ isOpen: false });
  }
}
