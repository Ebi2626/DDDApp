import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCompletionsComponent } from './single-completions.component';

describe('SingleCompletionsComponent', () => {
  let component: SingleCompletionsComponent;
  let fixture: ComponentFixture<SingleCompletionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleCompletionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleCompletionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
