import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class ResourceService {
    private resourceStore: any;

    constructor(private httpClient: HttpClient) {
        this.httpClient.get('assets\\resources.de.json', {responseType: 'json'}).subscribe(
            data => this.resourceStore = data
        );
    }

    get(key: string) {
        return this.resourceStore[key];
    }
}