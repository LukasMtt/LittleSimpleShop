import { Injectable } from '@angular/core';
import { EndpointNode } from '../enums/endpoint-item.enum';
import { AppConfigService } from './app.config.service';
import { KeyValue } from '@angular/common';

export enum EndpointItem {
  ROOT = '',

  Shop = 'shop/',
  Product = 'product/',
  News = 'news/',
  Payment = 'payment/',
  Metadata = 'metadata/',

  GetAllCategories = 'getAllCategories',
  GetAllProducts = 'getAllProducts',
  GetAllProductsInSale = 'getAllProductsInSale',
  GetAllProductsByCategoryId = 'getAllProductsByCategoryId',
  GetProductsByCategoryIdCount = 'getProductsByCategoryIdCount',
  GetAllProductsCount = 'getAllProductsCount',
  GetAllProductsInSaleCount = 'getAllProductsInSaleCount',
  GetProductById = 'getProductById',
  GetProductsByIds = 'getProductsByIds',
  GetAllNews = 'getAllNews',
  CreateCheckoutSession = 'createCheckoutSession',
  GetMetadata = 'getMetadata'
}

@Injectable({
  providedIn: 'root'
})
export class EndpointResolveService {
  root: EndpointNode = { parent: null, item: EndpointItem.ROOT };

  shop: EndpointNode = { parent: this.root, item: EndpointItem.Shop };

  product: EndpointNode = { parent: this.shop, item: EndpointItem.Product };
  news: EndpointNode = { parent: this.shop, item: EndpointItem.News };
  payment: EndpointNode = { parent: this.shop, item: EndpointItem.Payment };
  metadata: EndpointNode = { parent: this.shop, item: EndpointItem.Metadata };

  getAllCategories: EndpointNode = {
    parent: this.product,
    item: EndpointItem.GetAllCategories
  };
  getAllProducts: EndpointNode = {
    parent: this.product,
    item: EndpointItem.GetAllProducts
  };
  getAllProductsInSale: EndpointNode = {
    parent: this.product,
    item: EndpointItem.GetAllProductsInSale
  };
  getAllProductsCount: EndpointNode = {
    parent: this.product,
    item: EndpointItem.GetAllProductsCount
  };
  getAllProductsInSaleCount: EndpointNode = {
    parent: this.product,
    item: EndpointItem.GetAllProductsInSaleCount
  };
  getAllProductsByCategoryId: EndpointNode = {
    parent: this.product,
    item: EndpointItem.GetAllProductsByCategoryId
  };
  getProductsByCategoryIdCount: EndpointNode = {
    parent: this.product,
    item: EndpointItem.GetProductsByCategoryIdCount
  };
  getProductById: EndpointNode = {
    parent: this.product,
    item: EndpointItem.GetProductById
  };
  getProductsByIds: EndpointNode = {
    parent: this.product,
    item: EndpointItem.GetProductsByIds
  };
  getAllNews: EndpointNode = {
    parent: this.news,
    item: EndpointItem.GetAllNews
  };
  createCheckoutSession: EndpointNode = {
    parent: this.payment,
    item: EndpointItem.CreateCheckoutSession
  };
  getMetadata: EndpointNode = {
    parent: this.metadata,
    item: EndpointItem.GetMetadata
  };

  leafList: EndpointNode[] = [
    this.getAllCategories,
    this.getAllProducts,
    this.getAllProductsByCategoryId,
    this.getProductsByCategoryIdCount,
    this.getProductById,
    this.getProductsByIds,
    this.getAllNews,
    this.getAllProductsCount,
    this.getAllProductsInSale,
    this.getAllProductsInSaleCount,
    this.createCheckoutSession,
    this.getMetadata
  ];

  apiBaseEndpointUrl = '';

  constructor(appConfigService: AppConfigService) {
    this.apiBaseEndpointUrl =
      appConfigService.getConfigProperty('apiBaseEndpointUrl');
  }

  public buildUrl(leaf: EndpointItem, params: KeyValue<string, string>[]) {
    var hasParams = params && params.length > 0;
    var paramSuffix = hasParams ? '?' : '';
    params.forEach((pair) => {
      paramSuffix += `${pair.key}=${pair.value}&`;
    });
    paramSuffix = hasParams ? paramSuffix.slice(0, -1) : paramSuffix;
    return `${this.resolvePath(leaf)}${paramSuffix}`;
  }

  private concatEndpointNodes(suffix: string, current: EndpointNode): string {
    if (!current.parent) return suffix;
    return this.concatEndpointNodes(
      `${current.item.toString()}${suffix}`,
      current.parent
    );
  }

  private resolvePath(leaf: EndpointItem) {
    var targetLeafCandidates = this.leafList.filter(
      (x) => x.item.toString() == leaf.toString()
    );

    if (targetLeafCandidates.length != 1) {
      return '';
    }

    return `${this.apiBaseEndpointUrl}/${this.concatEndpointNodes(
      '',
      targetLeafCandidates[0]
    )}`;
  }
}
