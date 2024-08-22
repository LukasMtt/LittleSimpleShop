import { ResourceService } from '../services/resource.service';

export class BaseComponent {
    resourceService: ResourceService;

    constructor(resourceService: ResourceService) {
        this.resourceService = resourceService
    }
}