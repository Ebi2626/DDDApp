import { Color } from 'dddapp-common';
import { ActionReducer, Action } from '@ngrx/store';
import * as R from 'ramda';

export interface LocalStorageState {
  colors: Color[];
}

function setSavedState(state: any, localStorageKey: string) {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}
function getSavedState(localStorageKey: string): any {
  const item = localStorage.getItem(localStorageKey);
  return item && JSON.parse(item);
}

// the keys from state which we'd like to save.
const stateKeys = ['settings', 'settings', 'colors'];
// the key for the local storage.
const localStorageKey = '__dddapp__';
let onInit = true; // after load/refresh…

export function storageMetaReducer(reducer: ActionReducer<any>) {
  const metaReducer: ActionReducer<any> = (state, action: Action) => {
    // reduce the nextState.
    const nextState = reducer(state, action);
    // init the application state.
    if (onInit) {
      onInit = false;
      const savedState = getSavedState(localStorageKey);
      const updatedState = savedState
        ? R.assocPath(stateKeys, savedState, state)
        : state;
      return reducer(updatedState, action);
    }

    // save the next state to the application storage.
    const stateToSave = R.path(stateKeys, nextState);
    stateToSave && setSavedState(stateToSave, localStorageKey);
    return reducer(state, action);
  };
  return metaReducer;
}
