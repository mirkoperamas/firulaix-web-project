import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdquiereComponent } from './adquiere.component';

describe('AdquiereComponent', () => {
  let component: AdquiereComponent;
  let fixture: ComponentFixture<AdquiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdquiereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdquiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
