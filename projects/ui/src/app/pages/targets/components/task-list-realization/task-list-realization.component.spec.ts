import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListRealizationComponent } from './task-list-realization.component';

describe('TaskListRealizationComponent', () => {
  let component: TaskListRealizationComponent;
  let fixture: ComponentFixture<TaskListRealizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskListRealizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListRealizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
