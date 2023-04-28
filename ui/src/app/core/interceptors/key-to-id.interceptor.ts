import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as R from 'ramda';

@Injectable()
export class KeyToIdInterceptor implements HttpInterceptor {

  constructor() {}

  private checkAllPropertiesAndReplaceKey(event: HttpEvent<any>, keyToReplace: string, newKey: string): HttpEvent<any> {
    if (event instanceof HttpResponse) {
      const stringObj = JSON.stringify(event.body);
      console.log('przed przerobieniem: ', event);
      const regex = new RegExp(keyToReplace, 'g');
      console.log('przerobione: ', JSON.parse(R.replace(regex, newKey, stringObj)));
      return event.clone({body: JSON.parse(R.replace(regex, newKey, stringObj))});
    } else {
      return event;
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('z interceptora leci request: ', request);
    return next.handle(request).pipe(
      map((event => this.checkAllPropertiesAndReplaceKey(event, '_key', 'id')
      )))
  }
}
