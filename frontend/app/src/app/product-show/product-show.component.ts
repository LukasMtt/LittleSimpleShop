import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { debounceTime, fromEvent } from 'rxjs';
import { NgModule, HostListener } from '@angular/core';

@Component({
  selector: 'app-product-show',
  standalone: true,
  imports: [],
  templateUrl: './product-show.component.html',
  styleUrl: './product-show.component.css'
})
export class ProductShowComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) productId!: number;
  
  product: Product | undefined;

  @ViewChild('previewProductColumn') previewProductColumn?: ElementRef;
  @ViewChild('mainImage') mainImage?: ElementRef;
  @ViewChild('buttonGroupMainImage') buttonGroupMainImage?: ElementRef;

  constructor(private productService: ProductService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId ?? 0).subscribe((data) => 
      { 
       this.product = data;
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.resizeButtonGroup(), 200);
    fromEvent(window, 'resize').pipe(debounceTime(50)).subscribe(() => {
      this.resizeButtonGroup();
    });
  }

  resizeButtonGroup() {
    var heightPreviewProductColumn = this.previewProductColumn?.nativeElement.offsetHeight ?? 0;
    var heightMainImage = this.mainImage?.nativeElement.offsetHeight ?? 0;
    var diffHeight = heightPreviewProductColumn - heightMainImage - 10;

    if (this.buttonGroupMainImage?.nativeElement)
      this.renderer.setStyle(this.buttonGroupMainImage.nativeElement, 'height', `${diffHeight}px`);
  }

  createImage() {
    if (this.product) {
      return 'data:image/webp;base64,' + this.product?.image[0].bytes;
    }
    return '';
  }
}
