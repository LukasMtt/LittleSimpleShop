import { Component } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { ButtonComponent } from '../shared/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent extends BaseComponent {}
