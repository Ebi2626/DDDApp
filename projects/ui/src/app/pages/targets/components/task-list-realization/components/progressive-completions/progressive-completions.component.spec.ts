import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressiveCompletionsComponent } from './progressive-completions.component';

describe('ProgressiveCompletionsComponent', () => {
  let component: ProgressiveCompletionsComponent;
  let fixture: ComponentFixture<ProgressiveCompletionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressiveCompletionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressiveCompletionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
