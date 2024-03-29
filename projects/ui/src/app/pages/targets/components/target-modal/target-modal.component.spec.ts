import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetModalComponent } from './target-modal.component';

describe('TargetModalComponent', () => {
  let component: TargetModalComponent;
  let fixture: ComponentFixture<TargetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
