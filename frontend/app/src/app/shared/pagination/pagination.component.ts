import { Component, EventEmitter, Output } from '@angular/core'

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.css',
    standalone: true
})
export class PaginationComponent {
    @Output() clickArrowOutput = new EventEmitter<boolean>()

    clickArrow(isForward: boolean) {
        this.clickArrowOutput.emit(isForward)
    }
}