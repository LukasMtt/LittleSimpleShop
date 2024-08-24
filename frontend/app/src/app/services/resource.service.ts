import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class ResourceService {
    private resourceObservable: Observable<Object>

    constructor(httpClient: HttpClient) {
        this.resourceObservable = httpClient.get('assets\\resources.de.json', {responseType: 'json'});
    }

    getResourceObservable() {
        return this.resourceObservable;
    }
}