import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingpolicyComponent } from './shippingpolicy.component';

describe('ShippingpolicyComponent', () => {
  let component: ShippingpolicyComponent;
  let fixture: ComponentFixture<ShippingpolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingpolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
