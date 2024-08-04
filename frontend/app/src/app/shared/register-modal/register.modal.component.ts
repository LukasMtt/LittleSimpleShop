import { Component, EventEmitter, Output } from '@angular/core' 
import { FormsModule } from '@angular/forms'
import { PasswordService } from '../../services/password.service'

@Component({
    selector: 'app-register-modal',
    templateUrl: './register.modal.component.html',
    styleUrl: './register.modal.component.css',
    imports: [FormsModule],
    standalone: true
})
export class RegisterModalComponent {
    @Output() closeModalButton = new EventEmitter<void>()

    email = ''
    password = ''
    passwordConfirmed = ''

    passwordService: PasswordService | undefined;

    constructor(passwordService: PasswordService) {
        this.passwordService = passwordService;
    }

    closeRegisterModal() {
        this.closeModalButton.emit();
    }

    logInputs() {
        console.log(`We got ${this.email} and ${this.password} and ${this.passwordConfirmed}`);
        console.log(`Validation: ${this.passwordService?.validatePasswordEquality(this.password, this.passwordConfirmed)}`);
    }
}