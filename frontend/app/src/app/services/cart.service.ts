import { Injectable, signal } from '@angular/core';
import { CartModel } from '../models/component/cart.model';
import { CartItemModel } from '../models/component/cart-item.model';
import { ProductService } from './product.service';
import {
  EndpointItem,
  EndpointResolveService
} from './endpoint.resolve.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = signal<CartModel>({ cartItems: [] });

  cartReadonly = this.cart.asReadonly();
  cartInitialized = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private endpointResolveService: EndpointResolveService,
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {
    const cartToken = this.cookieService.get('CartToken');
    if (cartToken) {
      this.getAndSetCart();
    } else {
      this.createAndSetCart();
    }
  }

  public getAndSetCart() {
    this.httpClient
      .get<
        CartModel | undefined
      >(this.endpointResolveService.buildUrl(EndpointItem.GetCart, []), { withCredentials: true })
      .subscribe((cart) => {
        if (cart) {
          this.productService
            .getProductsByIds(
              cart.cartItems.map((x) => x.productId).filter((x) => x)
            )
            .subscribe((products) => {
              const cartItems: CartItemModel[] = [];
              products.forEach((product) => {
                const amount = cart.cartItems.find(
                  (x) => x.productId == product.id
                )?.amount;
                if (product && amount) {
                  const mainProductImage = product.images[0];
                  cartItems.push({
                    productId: product.id,
                    product: {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: {
                        id: mainProductImage.id,
                        fileId: mainProductImage.fileId,
                        productId: mainProductImage.productId,
                        fileContent: { dataUrl: '' }
                      }
                    },
                    amount: amount
                  });
                }
              });
              this.cart.set({ cartItems: cartItems });
              this.cartInitialized.set(true);
            });
        }
      });
  }

  public createAndSetCart() {
    this.httpClient
      .post<boolean>(
        this.endpointResolveService.buildUrl(EndpointItem.CreateCart, []),
        {},
        { withCredentials: true }
      )
      .subscribe((successful) => {
        if (successful) {
          this.cart.set({ cartItems: [] });
          this.cartInitialized.set(true);
        }
      });
  }

  public pushCartItem(item: CartItemModel) {
    const cartItems = this.cart().cartItems;
    const existingItem = cartItems.find(
      (x) => x.product && item.product && x.product.id === item.product.id
    );
    if (existingItem) {
      return this.updateCartItemAmount(
        existingItem.product.id,
        existingItem.amount + item.amount
      );
    } else {
      cartItems.push(item);
    }
    this.httpClient
      .post<number>(
        this.endpointResolveService.buildUrl(EndpointItem.PushCartItem, []),
        item,
        { withCredentials: true }
      )
      .subscribe((count) => {
        if (count && count > 0) {
          this.cart.set({ cartItems: cartItems });
        }
      });
  }

  public popCartItemByProductId(productId: number) {
    let cartItems = this.cart().cartItems;
    const item = cartItems.find((x) => x.product && x.product.id == productId);
    cartItems = cartItems.filter((x) => x != item);
    this.httpClient
      .post<number>(
        this.endpointResolveService.buildUrl(
          EndpointItem.PopCartItemByProductId,
          [{ key: 'productId', value: `${productId}` }]
        ),
        {},
        { withCredentials: true }
      )
      .subscribe((count) => {
        if (count && count > 0) {
          this.cart.set({ cartItems: cartItems });
        }
      });
  }

  public updateCartItemAmount(productId: number, amount: number) {
    let cartItems = this.cart().cartItems;
    const item = cartItems.find((x) => x.product && x.product.id == productId);
    if (item) {
      item.amount = amount;
      if (amount < 1) {
        cartItems = cartItems.filter((x) => x != item);
      }
      this.httpClient
        .post<number>(
          this.endpointResolveService.buildUrl(
            EndpointItem.UpdateCartItemAmountByProductId,
            [
              { key: 'productId', value: `${productId}` },
              { key: 'amount', value: `${amount}` }
            ]
          ),
          {},
          { withCredentials: true }
        )
        .subscribe((count) => {
          if (count && count > 0) {
            this.cart.set({ cartItems: cartItems });
          }
        });
    }
  }

  public resetCart() {
    this.httpClient
      .get<number>(
        this.endpointResolveService.buildUrl(EndpointItem.ArchiveCart, []),
        { withCredentials: true }
      )
      .subscribe((count) => {
        if (count && count > 0) {
          this.cart.set({ cartItems: [] });
          this.cookieService.delete('CartToken', '/');
          this.createAndSetCart();
        }
      });
  }

  public getCartPriceSum(shippingCost: number) {
    const invalidBaseItems = this.cart()?.cartItems.filter(
      (x) => x.product.price === undefined || x.product.price <= 0
    );
    if (invalidBaseItems && invalidBaseItems.length > 0) {
      return 0;
    }
    const baseItems = this.cart()?.cartItems.filter((x) => x.amount > 0);
    if (baseItems && baseItems.length > 0) {
      return (
        baseItems
          .map((x) => x.product.price! * x.amount)
          .reduce((x, y) => (x += y)) + shippingCost
      );
    }
    return 0;
  }
}
