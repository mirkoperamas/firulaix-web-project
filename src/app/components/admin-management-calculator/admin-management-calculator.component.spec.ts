import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManagementCalculatorComponent } from './admin-management-calculator.component';

describe('AdminManagementCalculatorComponent', () => {
  let component: AdminManagementCalculatorComponent;
  let fixture: ComponentFixture<AdminManagementCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManagementCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManagementCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
