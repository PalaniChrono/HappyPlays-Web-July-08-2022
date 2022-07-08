import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdsNblogsComponent } from './prods-nblogs.component';

describe('ProdsNblogsComponent', () => {
  let component: ProdsNblogsComponent;
  let fixture: ComponentFixture<ProdsNblogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdsNblogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdsNblogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
