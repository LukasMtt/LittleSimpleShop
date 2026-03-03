import { Injectable } from '@angular/core';
import { EndpointNode } from '../enums/endpoint-item.enum';
import { AppConfigService } from './app.config.service';
import { KeyValue } from '@angular/common';

export enum EndpointItem {
  ROOT = '',

  Shop = 'shop/',
  Product = 'product/',
  Category = 'category/',
  News = 'news/',
  Payment = 'payment/',
  Metadata = 'metadata/',
  PublicImage = 'publicImage/',
  Shipping = 'shipping/',
  Cart = 'cart/',

  GetAllCustomCategories = 'getAllCustomCategories',
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
  GetMetadata = 'getMetadata',
  GetPublicImage = 'getPublicImage',
  GetSaleCategory = 'getSaleCategory',
  GetAllCategory = 'getAllCategory',
  GetShippingTimeEstimation = 'getShippingTimeEstimation',
  GetCart = 'getCart',
  CreateCart = 'createCart',
  PushCartItem = 'pushCartItem',
  PopCartItemByProductId = 'popCartItemByProductId',
  UpdateCartItemAmountByProductId = 'updateCartItemAmountByProductId',
  AchieveCart = 'achieveCart'
}

@Injectable({
  providedIn: 'root'
})
export class EndpointResolveService {
  root: EndpointNode = { parent: null, item: EndpointItem.ROOT };

  shop: EndpointNode = { parent: this.root, item: EndpointItem.Shop };

  product: EndpointNode = { parent: this.shop, item: EndpointItem.Product };
  category: EndpointNode = { parent: this.shop, item: EndpointItem.Category };
  news: EndpointNode = { parent: this.shop, item: EndpointItem.News };
  payment: EndpointNode = { parent: this.shop, item: EndpointItem.Payment };
  metadata: EndpointNode = { parent: this.shop, item: EndpointItem.Metadata };
  publicImage: EndpointNode = {
    parent: this.shop,
    item: EndpointItem.PublicImage
  };
  shipping: EndpointNode = {
    parent: this.shop,
    item: EndpointItem.Shipping
  };
  cart: EndpointNode = { parent: this.shop, item: EndpointItem.Cart };

  getAllCustomCategories: EndpointNode = {
    parent: this.category,
    item: EndpointItem.GetAllCustomCategories
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
  getPublicImage: EndpointNode = {
    parent: this.publicImage,
    item: EndpointItem.GetPublicImage
  };
  getSaleCategory: EndpointNode = {
    parent: this.category,
    item: EndpointItem.GetSaleCategory
  };
  getAllCategory: EndpointNode = {
    parent: this.category,
    item: EndpointItem.GetAllCategory
  };
  getShippingTimeEstimation: EndpointNode = {
    parent: this.shipping,
    item: EndpointItem.GetShippingTimeEstimation
  };
  getCart: EndpointNode = {
    parent: this.cart,
    item: EndpointItem.GetCart
  };
  createCart: EndpointNode = {
    parent: this.cart,
    item: EndpointItem.CreateCart
  };
  pushCartItem: EndpointNode = {
    parent: this.cart,
    item: EndpointItem.PushCartItem
  };
  popCartItemByProductId: EndpointNode = {
    parent: this.cart,
    item: EndpointItem.PopCartItemByProductId
  };
  updateCartItemAmountByProductId: EndpointNode = {
    parent: this.cart,
    item: EndpointItem.UpdateCartItemAmountByProductId
  };
  achieveCart: EndpointNode = {
    parent: this.cart,
    item: EndpointItem.AchieveCart
  };

  leafList: EndpointNode[] = [
    this.getAllCustomCategories,
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
    this.getMetadata,
    this.getPublicImage,
    this.getSaleCategory,
    this.getAllCategory,
    this.getShippingTimeEstimation,
    this.getCart,
    this.createCart,
    this.pushCartItem,
    this.popCartItemByProductId,
    this.updateCartItemAmountByProductId,
    this.achieveCart
  ];

  apiBaseEndpointUrl = '';

  constructor(appConfigService: AppConfigService) {
    this.apiBaseEndpointUrl =
      appConfigService.getConfigProperty('apiBaseEndpointUrl');
  }

  public buildUrl(leaf: EndpointItem, params: KeyValue<string, string>[]) {
    const hasParams = params && params.length > 0;
    let paramSuffix = hasParams ? '?' : '';
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
    const targetLeafCandidates = this.leafList.filter(
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
