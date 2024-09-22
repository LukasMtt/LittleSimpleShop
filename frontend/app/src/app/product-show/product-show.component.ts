import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { debounceTime, fromEvent } from 'rxjs';
import { NgModule, HostListener } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";

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

  constructor(private productService: ProductService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId ?? 0).subscribe((data) => 
      { 
       this.product = data;
      });
  }

  createImage() {
    if (this.product) {
      return 'data:image/webp;base64,' + this.product?.image[0].bytes;
    }
    return '';
  }

  getFirstImage() {
    return this.product?.image[0] ? [this.product!.image[0]] : undefined
  }
}
