import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPerformanceComponent } from './staff-performance.component';

describe('StaffPerformanceComponent', () => {
  let component: StaffPerformanceComponent;
  let fixture: ComponentFixture<StaffPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
