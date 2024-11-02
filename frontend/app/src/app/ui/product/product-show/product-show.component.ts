import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { CarouselComponent } from "../../shared/carousel/carousel.component";
import { CartService } from '../../../services/cart.service';
import { CardViewable } from '../../../models/card.viewable.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-show',
  standalone: true,
  imports: [CarouselComponent, CurrencyPipe],
  templateUrl: './product-show.component.html',
  styleUrl: './product-show.component.css'
})
export class ProductShowComponent implements OnInit {
  @Input({ required: true }) productId!: number;
  
  product: Product | undefined;

  constructor(private productService: ProductService, private cartService: CartService) {
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId ?? 0).subscribe((data) => 
      { 
       this.product = data;
      });
  }

  getPrice(cardViewable: CardViewable | undefined) {
    var product = cardViewable as Product;
    if (product) {
        return product.price;
    }
    return '';
  }

  addProductToCart() {
    if (this.product)
      this.cartService.pushCartItem( {
        product: this.product,
        count: 1
      });
    else
      console.log("Adding product to cart failed. No product accessible.");
  }

  createImage() {
    if (this.product) {
      return 'data:image/webp;base64,' + this.product?.images[0].bytes;
    }
    return '';
  }

  getImages() {
    return this.product?.images ? [this.product!.images[0], this.product!.images[0], this.product!.images[0]] : []
  }
}
