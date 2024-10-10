import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CarouselComponent } from "../carousel/carousel.component";
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-show',
  standalone: true,
  imports: [CarouselComponent],
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
