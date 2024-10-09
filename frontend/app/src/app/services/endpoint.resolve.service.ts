import { Injectable } from "@angular/core"
import { EndpointNode } from "../enums/endpoint-item.enum"
import { AppConfigService } from "./app.config.service"
import { KeyValue } from "@angular/common"

export enum EndpointItem {
    ROOT = "",
    Shop = "shop/",
    Product = "product/",
    GetAllCategories = "getAllCategories",
    GetAllProducts = "getAllProducts",
    GetAllProductsByCategoryId = "getAllProductsByCategoryId",
    GetProductsByCategoryIdCount = "getProductsByCategoryIdCount",
    GetProductById = "getProductById"
}

@Injectable({
    providedIn: 'root'
})
export class EndpointResolveService {
    root: EndpointNode = { parent: null, item: EndpointItem.ROOT }

    shop: EndpointNode = { parent: this.root, item: EndpointItem.Shop }

    product: EndpointNode = { parent: this.shop, item: EndpointItem.Product }

    getAllCategories: EndpointNode = { parent: this.product, item: EndpointItem.GetAllCategories }
    getAllProducts: EndpointNode = { parent: this.product, item: EndpointItem.GetAllProducts }
    getAllProductsByCategoryId: EndpointNode = { parent: this.product, item: EndpointItem.GetAllProductsByCategoryId }
    getProductsByCategoryIdCount: EndpointNode = { parent: this.product, item: EndpointItem.GetProductsByCategoryIdCount }
    getProductById: EndpointNode = { parent: this.product, item: EndpointItem.GetProductById }

    leafList: EndpointNode[] = [
        this.getAllCategories, this.getAllProducts, this.getAllProductsByCategoryId, this.getProductsByCategoryIdCount, this.getProductById
    ]

    apiBaseEndpointUrl = ""

    constructor(appConfigService: AppConfigService) {
        this.apiBaseEndpointUrl = appConfigService.getConfigProperty("apiBaseEndpointUrl");
    }

    public buildUrl(leaf: EndpointItem, params: KeyValue<string, string>[]) {
        var hasParams = params && params.length > 0;
        var paramSuffix = hasParams ? "?" : ""; 
        params.forEach(pair => {
            paramSuffix += `${pair.key}=${pair.value}&`;
        });
        paramSuffix = hasParams ? paramSuffix.slice(0, -1) : paramSuffix;
        return `${this.resolvePath(leaf)}${paramSuffix}`;
    }

    private concatEndpointNodes(suffix: string, current: EndpointNode): string {
        if (!current.parent)
            return suffix;
        return this.concatEndpointNodes(`${current.item.toString()}${suffix}`, current.parent);
    }

    private resolvePath(leaf: EndpointItem) {
        var targetLeafCandidates = this.leafList.filter((x) => x.item.toString() == leaf.toString());

        if(targetLeafCandidates.length != 1) {
            return "";
        }

        return `${this.apiBaseEndpointUrl}/${this.concatEndpointNodes("", targetLeafCandidates[0])}`;
    }
}