import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedtocheckoutComponent } from './proceedtocheckout.component';

describe('ProceedtocheckoutComponent', () => {
  let component: ProceedtocheckoutComponent;
  let fixture: ComponentFixture<ProceedtocheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceedtocheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedtocheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
