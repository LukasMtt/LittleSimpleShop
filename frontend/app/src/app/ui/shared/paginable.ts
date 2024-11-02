import { PageEvent } from "@angular/material/paginator";

export declare interface Paginable {
    onPageChange(event: PageEvent) : void;
    getTotalDataLength(): number;
}