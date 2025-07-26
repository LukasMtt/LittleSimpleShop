import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbCheckoutComponent } from './breadcrumb-checkout.component';

describe('BreadcrumbCheckoutComponent', () => {
  let component: BreadcrumbCheckoutComponent;
  let fixture: ComponentFixture<BreadcrumbCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbCheckoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreadcrumbCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
