import { TestBed } from '@angular/core/testing';

import { KeyToIdInterceptor } from './key-to-id.interceptor';

describe('KeyToIdInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      KeyToIdInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: KeyToIdInterceptor = TestBed.inject(KeyToIdInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
