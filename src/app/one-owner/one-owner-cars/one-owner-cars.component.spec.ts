import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOwnerCarsComponent } from './one-owner-cars.component';

describe('OneOwnerCarsComponent', () => {
  let component: OneOwnerCarsComponent;
  let fixture: ComponentFixture<OneOwnerCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneOwnerCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneOwnerCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
