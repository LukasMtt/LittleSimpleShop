import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { BaseComponent } from '../base.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-breadcrumb-checkout',
  imports: [MatIcon, NgClass],
  templateUrl: './breadcrumb-checkout.component.html',
  styleUrl: './breadcrumb-checkout.component.css'
})
export class BreadcrumbCheckoutComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input() currentStep: number = 0;
  @Input() steps: {
    stepDisplayValue: string;
    position: number;
    makeStepAccessible: boolean;
  }[] = [];
  @Input() maxStep: number = 0;

  numOfSteps: number = 0;

  @Output() currentStepChange: EventEmitter<number> =
    new EventEmitter<number>();

  constructor() {
    super();
  }

  public ngOnInit(): void {
    this.steps = this.steps.sort((x, y) => x.position - y.position);
    this.numOfSteps = this.steps.length;
  }

  public ngOnChanges(): void {
    this.updateStepInternal(this.currentStep);
  }

  public updateStep(step: number): void {
    this.updateStepInternal(step);
  }

  private updateStepInternal(step: number): void {
    let stepItem = null;
    if (this.steps && this.steps.length > 0)
      stepItem = this.steps.find((x) => x.position == step);
    if (step > this.maxStep + 1 || stepItem?.makeStepAccessible == false) {
      return;
    }
    if (step > this.maxStep) {
      this.maxStep = step;
    }
    this.currentStep = step;
    this.currentStepChange.emit(this.currentStep);
  }
}
