import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdquirirComponent } from './adquirir.component';

describe('AdquirirComponent', () => {
  let component: AdquirirComponent;
  let fixture: ComponentFixture<AdquirirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdquirirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdquirirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
