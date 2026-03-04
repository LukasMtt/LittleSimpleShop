import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOrderStateComponent } from './check-order-state.component';

describe('CheckOrderStateComponent', () => {
  let component: CheckOrderStateComponent;
  let fixture: ComponentFixture<CheckOrderStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckOrderStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckOrderStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
