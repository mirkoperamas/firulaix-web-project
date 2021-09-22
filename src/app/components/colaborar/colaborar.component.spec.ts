import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaborarComponent } from './colaborar.component';

describe('ColaborarComponent', () => {
  let component: ColaborarComponent;
  let fixture: ComponentFixture<ColaborarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColaborarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColaborarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
