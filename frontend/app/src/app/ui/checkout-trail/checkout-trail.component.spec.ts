import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutTrailComponent } from './checkout-trail.component';

describe('CheckoutTrailComponent', () => {
  let component: CheckoutTrailComponent;
  let fixture: ComponentFixture<CheckoutTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutTrailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckoutTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
