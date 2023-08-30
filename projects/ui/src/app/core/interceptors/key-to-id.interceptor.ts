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

  replacePropertyWithGivenKey(textToReplace: string | RegExp, expectedText: string, sourceText: string){
    return R.replace(textToReplace, expectedText, sourceText)
  };

  private checkAllPropertiesAndReplaceKey(event: HttpEvent<any>, keyToReplace: string, newKey: string): HttpEvent<any> {
    if (event instanceof HttpResponse) {
      const stringObj = JSON.stringify(event.body);
      const regex = new RegExp(keyToReplace, 'g');
      const responseWithReplacedKeyWithId = this.replacePropertyWithGivenKey(regex, newKey, stringObj)
      return event.clone({body: JSON.parse(responseWithReplacedKeyWithId)});
    } else {
      return event;
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event => this.checkAllPropertiesAndReplaceKey(event, '_key', 'id')
      )))
  }
}
