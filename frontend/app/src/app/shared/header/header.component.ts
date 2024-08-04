import { Component, EventEmitter, Output } from '@angular/core' 

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true
})
export class HeaderComponent {
    headerTitle = "Lorem Ipsum"
    headerSubTitle = "Dupsio"

    @Output() clickRegisterButton = new EventEmitter<void>()

    openRegisterModal() {
        this.clickRegisterButton.emit();
    }
}