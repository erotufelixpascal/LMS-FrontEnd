import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCategoryComponent } from './loan-category.component';

describe('LoanCategoryComponent', () => {
  let component: LoanCategoryComponent;
  let fixture: ComponentFixture<LoanCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
