import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTargetsModalComponent } from './assign-targets-modal.component';

describe('AssignTargetsModalComponent', () => {
  let component: AssignTargetsModalComponent;
  let fixture: ComponentFixture<AssignTargetsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignTargetsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTargetsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
