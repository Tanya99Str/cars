import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOwnerComponent } from './one-owner.component';

describe('OneOwnerComponent', () => {
  let component: OneOwnerComponent;
  let fixture: ComponentFixture<OneOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
