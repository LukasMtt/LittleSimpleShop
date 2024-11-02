import { inject } from '@angular/core';
import { ResourceService } from '../../services/resource.service';

export class BaseComponent {
    protected resourceService = inject(ResourceService)

    protected res(name: string) {
        return this.resourceService.get(name);
    }
}