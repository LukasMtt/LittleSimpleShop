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
  standalone: true,
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
  }[] = [];

  numOfSteps: number = 0;
  maxStep: number = 0;

  @Output() currentStepChange: EventEmitter<number> =
    new EventEmitter<number>();

  public ngOnInit(): void {
    this.steps = this.steps.sort((a, b) => a.position - b.position);
    this.numOfSteps = this.steps.length;
  }

  public ngOnChanges(): void {
    this.updateStepInternal(this.currentStep);
  }

  public updateStep(step: number): void {
    this.updateStepInternal(step);
  }

  private updateStepInternal(step: number): void {
    if (step > this.maxStep + 1) {
      return;
    }
    if (step > this.maxStep) {
      this.maxStep = step;
    }
    this.currentStep = step;
    this.currentStepChange.emit(this.currentStep);
  }
}
