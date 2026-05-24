import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ProductCategory } from '../model/productCategory';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private url = `${environment.HOST}/product-categories`;
  private readonly http = inject(HttpClient);

  private readonly _productCategories = signal<ProductCategory[]>([]);
  private readonly _message = signal<string>('');

  readonly $productCategoriesChange = this._productCategories.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  findAll() {
    return this.http.get<ProductCategory[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<ProductCategory>(`${this.url}/${id}`);
  }

  save(category: ProductCategory) {
    return this.http.post(this.url, category);
  }

  update(id: number, category: ProductCategory) {
    return this.http.put(`${this.url}/${id}`, category);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setProductCategoryChange(data: ProductCategory[]) {
    this._productCategories.set(data);
  }

  setMessageChange(msg: string) {
    this._message.set(msg);
  }
}
