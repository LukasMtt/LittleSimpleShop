import { ResourceService } from '../services/resource.service';

export class BaseComponent {
    resourceService: ResourceService;
    resources: any;

    constructor(resourceService: ResourceService) {
        this.resourceService = resourceService;
        this.initRes();
    }

    res(key: string) {
        if (!this.resources || !key)
            return undefined;
        return this.resources[key];
    }

    private initRes() {
        this.resourceService.getResourceObservable().subscribe(
            data => this.resources = data
        );
    }
}