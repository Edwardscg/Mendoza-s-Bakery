import { Component, inject } from '@angular/core';
import { productCategory } from '../../model/productCategory';
import { ProductCategoryService } from '../../services/productCategory.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-product-category',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css',
})
export class ProductCategoryComponent {
  protected productCategories: productCategory[] = [];

  private readonly productCategoryService = inject(ProductCategoryService);

  ngOnInit(): void {
    this.productCategoryService.findAll().subscribe((data) => {
      console.log('Datos recibidos del backend:', data);
      this.productCategories = data;
    });
  }
}
