import { Component, inject } from '@angular/core';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {

  protected products: Product[] = [];

  private readonly productService = inject(ProductService);

  ngOnInit(): void {

    this.productService.findAll().subscribe((data) => {

      console.log('Datos recibidos del backend:', data);

      this.products = data;

    });

  }

}