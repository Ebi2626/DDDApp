import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclicCompletionsComponent } from './cyclic-completions.component';

describe('CyclicCompletionsComponent', () => {
  let component: CyclicCompletionsComponent;
  let fixture: ComponentFixture<CyclicCompletionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyclicCompletionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CyclicCompletionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
